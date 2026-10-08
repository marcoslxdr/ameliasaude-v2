"""Converte o export Tasy Guia Medico em dados públicos da busca de rede.

Uso: python3 scripts/import-provider-network.py '/caminho/Guia Médico Novo.xlsx'
Requer openpyxl. Valida a estrutura e só publica linhas ativas marcadas para o guia.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from openpyxl import load_workbook


REQUIRED_COLUMNS = {
    "REDE_NOME", "TIPO_SERVICO_DESCRICAO", "ESPECIALIDADE_DESCRICAO",
    "IE_GUIA_MEDICO_ESPEC", "NOME_FANTASIA", "ENDERECO_BAIRRO",
    "ENDERECO_MUNICIPIO", "ENDERECO_LOGRADOURO", "ENDERECO_NUMERO",
    "IE_GUIA_MEDICO", "DATA_EXCLUSAO",
}
RJ_CITIES = {
    "RIO DE JANEIRO", "NOVA IGUAÇU", "SÃO GONÇALO", "DUQUE DE CAXIAS",
    "MESQUITA", "NITERÓI", "SÃO JOÃO DE MERITI",
    "BELFORD ROXO", "NILÓPOLIS", "QUEIMADOS", "MAGÉ",
}


def clean(value: object) -> str:
    return str(value).strip() if value is not None else ""


def is_public(row: dict[str, str]) -> bool:
    """Publica apenas vínculos ativos com prestador E especialidade no guia.

    NÃO, campos vazios ou valores desconhecidos nunca autorizam publicação.
    Uma especialidade oculta não remove os outros vínculos autorizados.
    """
    return (
        row.get("IE_GUIA_MEDICO") == "SIM"
        and row.get("IE_GUIA_MEDICO_ESPEC") == "SIM"
        and not row.get("DATA_EXCLUSAO")
    )


def main(source: Path) -> None:
    workbook = load_workbook(source, read_only=True, data_only=True)
    sheet = workbook["Exportar Planilha"]
    rows = iter(sheet.values)
    headers = [clean(value) for value in next(rows)]
    missing = REQUIRED_COLUMNS - set(headers)
    if missing:
        raise ValueError(f"Colunas obrigatórias ausentes: {', '.join(sorted(missing))}")

    output = []
    excluded = 0
    for line_number, values in enumerate(rows, start=2):
        if not any(value is not None for value in values):
            continue
        row = {key: clean(value) for key, value in zip(headers, values)}
        if not is_public(row):
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
        number = row["ENDERECO_NUMERO"] or "número não informado"
        address = f'{row["ENDERECO_LOGRADOURO"]}, {number}'
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
            provider["phone"] = row["TELEFONE"]
        if row.get("AREA_ATUACAO"):
            provider["area"] = row["AREA_ATUACAO"]
        output.append(provider)

    # Cadastros internos distintos podem produzir o mesmo resultado público.
    # Consolida apenas cópias idênticas; diferenças públicas exigem revisão.
    unique = {}
    duplicates = 0
    for provider in output:
        previous = unique.get(provider["id"])
        if previous is not None:
            if previous != provider:
                raise ValueError("Linhas com mesma identidade e dados públicos conflitantes")
            duplicates += 1
        unique[provider["id"]] = provider
    output = list(unique.values())
    if not output:
        raise ValueError("Nenhum prestador ativo encontrado")

    destination = Path(__file__).resolve().parents[1] / "src/data/provider-network.json"
    destination.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Importados: {len(output)} registros; excluídos: {excluded}; duplicados consolidados: {duplicates}; arquivo: {destination}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python3 scripts/import-provider-network.py arquivo.xlsx")
    main(Path(sys.argv[1]))
