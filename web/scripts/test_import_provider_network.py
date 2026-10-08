"""Regras de visibilidade da rede credenciada. Executar com unittest discover."""

import importlib.util
from pathlib import Path
import unittest


spec = importlib.util.spec_from_file_location(
    "provider_import", Path(__file__).with_name("import-provider-network.py")
)
provider_import = importlib.util.module_from_spec(spec)
spec.loader.exec_module(provider_import)


class VisibilityTests(unittest.TestCase):
    def row(self, **changes):
        return {
            "NOME_FANTASIA": "CLÍNICA ATIVA",
            "IE_GUIA_MEDICO": "SIM",
            "IE_GUIA_MEDICO_ESPEC": "SIM",
            "DATA_EXCLUSAO": "",
            **changes,
        }

    def test_flags_must_both_be_sim(self):
        for provider_flag, specialty_flag, expected in (
            ("SIM", "SIM", True), ("NÃO", "SIM", False),
            ("SIM", "NÃO", False), ("NÃO", "NÃO", False),
            ("", "SIM", False), ("SIM", "", False),
        ):
            with self.subTest(provider=provider_flag, specialty=specialty_flag):
                self.assertEqual(provider_import.should_publish(self.row(
                    IE_GUIA_MEDICO=provider_flag,
                    IE_GUIA_MEDICO_ESPEC=specialty_flag,
                )), expected)

    def test_removed_provider_is_not_reintroduced_by_sim_flags(self):
        for name in ("AMERICAN COR", "HOSPITAL AMERICAN COR ", "hospital  american cor"):
            with self.subTest(name=name):
                self.assertFalse(provider_import.should_publish(self.row(NOME_FANTASIA=name)))

    def test_excluded_date_hides_provider(self):
        self.assertFalse(provider_import.should_publish(self.row(DATA_EXCLUSAO="2026-10-08")))


if __name__ == "__main__":
    unittest.main()
