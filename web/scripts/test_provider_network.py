"""Regressão da regra de publicação: python -m unittest discover -s scripts."""

import importlib.util
import json
import unittest
from itertools import product
from pathlib import Path
from unittest.mock import Mock, patch

spec = importlib.util.spec_from_file_location(
    "provider_import", Path(__file__).with_name("import-provider-network.py")
)
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class ProviderVisibilityTests(unittest.TestCase):
    def test_both_flags_must_be_sim(self):
        for provider, specialty in product(("SIM", "NÃO", "", "INVALIDO"), repeat=2):
            with self.subTest(provider=provider, specialty=specialty):
                self.assertEqual(
                    importer.is_public({
                        "IE_GUIA_MEDICO": provider,
                        "IE_GUIA_MEDICO_ESPEC": specialty,
                        "DATA_EXCLUSAO": "",
                    }),
                    provider == specialty == "SIM",
                )

    def test_excluded_provider_is_not_public(self):
        self.assertFalse(importer.is_public({
            "IE_GUIA_MEDICO": "SIM", "IE_GUIA_MEDICO_ESPEC": "SIM",
            "DATA_EXCLUSAO": "2026-10-07",
        }))

    def test_missing_flags_are_not_public(self):
        self.assertFalse(importer.is_public({}))

    def test_import_omits_hidden_rows_but_keeps_authorized_specialty(self):
        base = {
            "REDE_NOME": "AMELIA COM COPART",
            "TIPO_SERVICO_DESCRICAO": "CONSULTA",
            "ESPECIALIDADE_DESCRICAO": "CARDIOLOGIA",
            "IE_GUIA_MEDICO": "SIM", "IE_GUIA_MEDICO_ESPEC": "SIM",
            "DATA_EXCLUSAO": "", "NOME_FANTASIA": "CLINICA TESTE",
            "ENDERECO_BAIRRO": "CENTRO", "ENDERECO_MUNICIPIO": "MAGÉ",
            "ENDERECO_LOGRADOURO": "RUA TESTE", "ENDERECO_NUMERO": "1",
            "CNPJ": "CADASTRO A",
        }
        records = [
            base,
            {**base, "CNPJ": "CADASTRO B"},
            {**base, "IE_GUIA_MEDICO_ESPEC": "NÃO", "ESPECIALIDADE_DESCRICAO": "OCULTA"},
            {**base, "IE_GUIA_MEDICO": "NÃO", "NOME_FANTASIA": "OCULTO"},
            {**base, "DATA_EXCLUSAO": "2026-10-07", "NOME_FANTASIA": "EXCLUIDO"},
            {**base, "ENDERECO_NUMERO": "", "NOME_FANTASIA": "SEM NUMERO"},
        ]
        headers = list(base)
        sheet = Mock(values=[headers] + [[r[key] for key in headers] for r in records])
        with patch.object(importer, "load_workbook", return_value={"Exportar Planilha": sheet}), \
                patch.object(Path, "write_text") as write:
            importer.main(Path("fixture.xlsx"))
        published = json.loads(write.call_args.args[0])
        self.assertEqual(len(published), 2)
        self.assertEqual(published[0]["specialty"], "CARDIOLOGIA")
        self.assertEqual(published[0]["name"], "CLINICA TESTE")
        self.assertNotIn("IE_GUIA_MEDICO", published[0])
        self.assertEqual(published[1]["address"], "RUA TESTE, número não informado")


if __name__ == "__main__":
    unittest.main()
