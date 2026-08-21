import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractAttribution,
  formatWhatsappInput,
  isHoneypotTriggered,
  normalizeWhatsapp,
  validateAndNormalizeCotacao,
} from "../lib/cotacao";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    requestId: VALID_UUID,
    name: "Maria Silva",
    city: "Rio de Janeiro",
    email: "maria@example.com",
    whatsapp: "(21) 99999-9999",
    livesCount: 2,
    ages: [34, 8],
    consent: true,
    consentAt: "2026-08-13T12:00:00.000Z",
    source: {
      pageUrl: "https://www.ameliasaude.com.br/cotacao",
    },
    ...overrides,
  };
}

describe("validateAndNormalizeCotacao — vidas e idades", () => {
  it("aceita livesCount alinhado com ages", () => {
    const result = validateAndNormalizeCotacao(validInput());
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.livesCount, 2);
    assert.deepEqual(result.data.ages, [34, 8]);
  });

  it("rejeita menos idades do que vidas", () => {
    const result = validateAndNormalizeCotacao(
      validInput({ livesCount: 3, ages: [30, 12] }),
    );
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.code, "invalid_lives_ages");
  });

  it("rejeita mais idades do que vidas", () => {
    const result = validateAndNormalizeCotacao(
      validInput({ livesCount: 1, ages: [30, 12] }),
    );
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.code, "invalid_lives_ages");
  });

  it("aceita recém-nascido com idade zero e rejeita idade acima de 120", () => {
    const zero = validateAndNormalizeCotacao(
      validInput({ livesCount: 1, ages: [0] }),
    );
    const high = validateAndNormalizeCotacao(
      validInput({ livesCount: 1, ages: [121] }),
    );
    assert.equal(zero.success, true);
    assert.equal(high.success, false);
    if (!high.success) assert.equal(high.code, "invalid_lives_ages");
  });
});

describe("validateAndNormalizeCotacao — contrato do CRM", () => {
  it("rejeita nome ou cidade com menos de dois caracteres", () => {
    const shortName = validateAndNormalizeCotacao(validInput({ name: "A" }));
    const shortCity = validateAndNormalizeCotacao(validInput({ city: "R" }));

    assert.equal(shortName.success, false);
    assert.equal(shortCity.success, false);
  });

  it("rejeita e-mail acima do limite aceito pelo CRM", () => {
    const oversizedEmail = `${"a".repeat(250)}@x.com`;
    assert.equal(oversizedEmail.length > 255, true);

    const result = validateAndNormalizeCotacao(
      validInput({ email: oversizedEmail }),
    );

    assert.equal(result.success, false);
    if (!result.success) assert.equal(result.code, "invalid_email");
  });

  it("ignora referrer que não seja URL em vez de derrubar o lead", () => {
    const result = validateAndNormalizeCotacao(
      validInput({
        source: {
          pageUrl: "https://www.ameliasaude.com.br/cotacao",
          referrer: "android-app://com.google.android.googlequicksearchbox",
        },
      }),
    );

    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.source.referrer, undefined);
  });
});

describe("validateAndNormalizeCotacao — consentimento", () => {
  it("exige consent true", () => {
    const denied = validateAndNormalizeCotacao(validInput({ consent: false }));
    const missing = validateAndNormalizeCotacao(validInput({ consent: undefined }));
    assert.equal(denied.success, false);
    assert.equal(missing.success, false);
    if (!denied.success) assert.equal(denied.code, "consent_required");
    if (!missing.success) assert.equal(missing.code, "consent_required");
  });

  it("repassa consent true e consentAt ISO", () => {
    const result = validateAndNormalizeCotacao(validInput());
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.consent, true);
    assert.equal(result.data.consentAt, "2026-08-13T12:00:00.000Z");
  });
});

describe("validateAndNormalizeCotacao — email e telefone", () => {
  it("rejeita email inválido", () => {
    const result = validateAndNormalizeCotacao(
      validInput({ email: "nao-e-email" }),
    );
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.code, "invalid_email");
  });

  it("aceita e-mail vazio e normaliza para null", () => {
    const result = validateAndNormalizeCotacao(validInput({ email: "" }));
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.email, null);
  });

  it("normaliza email com trim e lowercase", () => {
    const result = validateAndNormalizeCotacao(
      validInput({ email: "  Maria.Silva@Example.COM  " }),
    );
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.email, "maria.silva@example.com");
  });

  it("rejeita telefone curto ou sem DDD", () => {
    const short = validateAndNormalizeCotacao(validInput({ whatsapp: "123" }));
    assert.equal(short.success, false);
    if (!short.success) assert.equal(short.code, "invalid_whatsapp");
  });

  it("rejeita DDD brasileiro inexistente antes de encaminhar ao CRM", () => {
    const result = validateAndNormalizeCotacao(
      validInput({ whatsapp: "(10) 99999-9999" }),
    );
    assert.equal(result.success, false);
    if (!result.success) assert.equal(result.code, "invalid_whatsapp");
  });

  it("normaliza WhatsApp BR para dígitos com 55", () => {
    const result = validateAndNormalizeCotacao(validInput());
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.whatsapp, "5521999999999");
  });
});

describe("normalizeWhatsapp", () => {
  it("formata WhatsApp local com DDD", () => {
    assert.equal(formatWhatsappInput("21999999999"), "(21) 99999-9999");
  });

  it("aceita 11 dígitos locais e prefixa 55", () => {
    assert.equal(normalizeWhatsapp("(21) 99999-9999"), "5521999999999");
  });

  it("mantém 55 quando já presente", () => {
    assert.equal(normalizeWhatsapp("+55 21 99999-9999"), "5521999999999");
  });

  it("rejeita sequência inválida", () => {
    assert.equal(normalizeWhatsapp("9999"), null);
  });
});

describe("extractAttribution — UTMs e click ids", () => {
  it("extrai só chaves conhecidas da pageUrl", () => {
    const source = extractAttribution({
      pageUrl:
        "https://www.ameliasaude.com.br/cotacao?utm_source=google&utm_medium=cpc&utm_campaign=plano&utm_content=ad1&utm_term=saude&gclid=GCL.123&fbclid=FB.456&email=secret@x.com&name=Maria",
      referrer: "https://www.google.com/",
    });

    assert.equal(source.pageUrl.startsWith("https://www.ameliasaude.com.br/cotacao"), true);
    assert.equal(source.referrer, "https://www.google.com/");
    assert.equal(source.utmSource, "google");
    assert.equal(source.utmMedium, "cpc");
    assert.equal(source.utmCampaign, "plano");
    assert.equal(source.utmContent, "ad1");
    assert.equal(source.utmTerm, "saude");
    assert.equal(source.gclid, "GCL.123");
    assert.equal(source.fbclid, "FB.456");
    assert.equal("email" in source, false);
    assert.equal("name" in source, false);
  });

  it("ignora parâmetros de atribuição vazios ou desconhecidos", () => {
    const source = extractAttribution({
      pageUrl: "https://www.ameliasaude.com.br/?utm_source=&foo=bar",
    });
    assert.equal(source.utmSource, undefined);
    assert.equal("foo" in source, false);
  });
});

describe("validateAndNormalizeCotacao — UTMs no payload", () => {
  it("repassa UTMs limitadas no source do CRM", () => {
    const result = validateAndNormalizeCotacao(
      validInput({
        source: {
          pageUrl:
            "https://www.ameliasaude.com.br/lp-roxo?utm_source=meta&utm_medium=paid&gclid=click1&email=leak@x.com",
          referrer: "https://l.facebook.com/",
          utmSource: "meta",
          utmMedium: "paid",
          gclid: "click1",
        },
      }),
    );

    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.source.utmSource, "meta");
    assert.equal(result.data.source.utmMedium, "paid");
    assert.equal(result.data.source.gclid, "click1");
    assert.equal(result.data.source.referrer, "https://l.facebook.com/");
    assert.equal("email" in result.data.source, false);
  });
});

describe("isHoneypotTriggered", () => {
  it("detecta website preenchido", () => {
    assert.equal(isHoneypotTriggered({ ...validInput(), website: "https://spam.test" }), true);
  });

  it("ignora honeypot vazio", () => {
    assert.equal(isHoneypotTriggered({ ...validInput(), website: "" }), false);
    assert.equal(isHoneypotTriggered(validInput()), false);
  });
});
