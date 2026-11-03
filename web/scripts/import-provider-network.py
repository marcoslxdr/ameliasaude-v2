"""Converte o export Tasy Guia Medico em dados públicos da busca de rede.

Uso: python3 scripts/import-provider-network.py '/caminho/Guia Medico 2.xlsx'
Requer openpyxl. Valida a estrutura e só publica linhas ativas marcadas para o guia.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from pathlib import Path



REQUIRED_COLUMNS = {
    "REDE_NOME", "TIPO_SERVICO_DESCRICAO", "ESPECIALIDADE_DESCRICAO",
    "IE_GUIA_MEDICO_ESPEC", "NOME_FANTASIA", "ENDERECO_BAIRRO",
    "ENDERECO_MUNICIPIO", "ENDERECO_LOGRADOURO", "ENDERECO_NUMERO",
    "IE_GUIA_MEDICO", "DATA_EXCLUSAO",
}
RJ_CITIES = {
    "RIO DE JANEIRO", "NOVA IGUAÇU", "SÃO GONÇALO", "DUQUE DE CAXIAS",
    "MESQUITA", "NITERÓI", "SÃO JOÃO DE MERITI", "BELFORD ROXO",
    "NILÓPOLIS", "QUEIMADOS", "MAGÉ",
}

def clean(value: object) -> str:
    return str(value).strip() if value is not None else ""


def should_publish(row: dict[str, str]) -> bool:
    return (
        clean(row["IE_GUIA_MEDICO"]).upper() == "SIM"
        and clean(row["IE_GUIA_MEDICO_ESPEC"]).upper() == "SIM"
        and not clean(row["DATA_EXCLUSAO"])
    )


def read_rows(source: Path, confirm_active: bool):
    if source.suffix.lower() == ".csv":
        if not confirm_active:
            raise ValueError("CSV sem DATA_EXCLUSAO: confirme a vigência com a Amélia e use --confirm-active")
        with source.open(encoding="utf-8-sig", newline="") as file:
            reader = csv.reader(file, delimiter=";")
            headers = [clean(value).upper().replace(" ", "_") for value in next(reader)]
            if "DATA_EXCLUSAO" not in headers:
                headers.append("DATA_EXCLUSAO")
                rows = [row + [""] for row in reader]
            else:
                rows = list(reader)
        return headers, rows
    from openpyxl import load_workbook
    workbook = load_workbook(source, read_only=True, data_only=True)
    rows = iter(workbook["Exportar Planilha"].values)
    return [clean(value) for value in next(rows)], rows


def main(source: Path, confirm_active: bool = False, destination: Path | None = None, ddd: str | None = None) -> None:
    headers, rows = read_rows(source, confirm_active)
    missing = REQUIRED_COLUMNS - set(headers)
    if missing:
        raise ValueError(f"Colunas obrigatórias ausentes: {', '.join(sorted(missing))}")

    output = []
    by_id = {}
    excluded = 0
    duplicates = 0
    for line_number, values in enumerate(rows, start=2):
        if not any(value is not None for value in values):
            continue
        row = {key: clean(value) for key, value in zip(headers, values)}
        if not should_publish(row):
            excluded += 1
            continue
        network = row["REDE_NOME"]
        if network.endswith(" COM COPART"):
            product = network.removesuffix(" COM COPART")
        elif network.endswith(" SEM COPART"):
            product = network.removesuffix(" SEM COPART")
        else:
            raise ValueError(f"Linha {line_number}: rede desconhecida: {network!r}")
        city = row["ENDERECO_MUNICIPIO"]
        if city not in RJ_CITIES:
            raise ValueError(f"Linha {line_number}: município sem UF confirmada: {city!r}")
        required_values = (
            "TIPO_SERVICO_DESCRICAO", "ESPECIALIDADE_DESCRICAO", "NOME_FANTASIA",
            "ENDERECO_BAIRRO", "ENDERECO_LOGRADOURO",
        )
        if any(not row[key] for key in required_values):
            raise ValueError(f"Linha {line_number}: campo público obrigatório vazio")
        address = row["ENDERECO_LOGRADOURO"]
        if row["ENDERECO_NUMERO"]:
            address += f', {row["ENDERECO_NUMERO"]}'
        identity = "|".join((network, row["TIPO_SERVICO_DESCRICAO"], row["ESPECIALIDADE_DESCRICAO"], row["NOME_FANTASIA"], address))
        provider = {
            "id": hashlib.sha256(identity.encode("utf-8")).hexdigest()[:16],
            "name": row["NOME_FANTASIA"],
            "product": product,
            "network": network,
            "serviceType": row["TIPO_SERVICO_DESCRICAO"],
            "specialty": row["ESPECIALIDADE_DESCRICAO"],
            "state": "RJ",
            "city": city,
            "neighborhood": row["ENDERECO_BAIRRO"],
            "address": address,
        }
        if row.get("TELEFONE"):
            phone = re.sub(r"\D", "", row["TELEFONE"])
            if len(phone) in (8, 9):
                if not ddd or not re.fullmatch(r"[1-9][0-9]", ddd):
                    raise ValueError(f"Linha {line_number}: telefone sem DDD; confirme o DDD e informe --ddd")
                phone = ddd + phone
            if len(phone) not in (10, 11):
                raise ValueError(f"Linha {line_number}: telefone inválido")
            provider["phone"] = phone
        if row.get("AREA_ATUACAO"):
            provider["area"] = row["AREA_ATUACAO"]
        previous = by_id.get(provider["id"])
        if previous is not None:
            if previous != provider:
                raise ValueError(f"Linha {line_number}: dados públicos conflitantes para o mesmo prestador")
            duplicates += 1
            continue
        by_id[provider["id"]] = provider
        output.append(provider)

    ids = [provider["id"] for provider in output]
    if len(set(ids)) != len(ids):
        raise ValueError("Linhas duplicadas na rede publicada")
    if not output:
        raise ValueError("Nenhum prestador ativo encontrado")

    destination = destination or Path(__file__).resolve().parents[1] / "src/rebranding/data/provider-network.json"
    destination.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Importados: {len(output)} registros; excluídos: {excluded}; duplicados: {duplicates}; arquivo: {destination}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--confirm-active", action="store_true", help="Confirmação externa de vigência do CSV sem data de exclusão")
    parser.add_argument("--output", type=Path, help="Arquivo de saída para revisão")
    parser.add_argument("--ddd", help="DDD confirmado para telefones sem código de área")
    args = parser.parse_args()
    main(args.source, args.confirm_active, args.output, args.ddd)
