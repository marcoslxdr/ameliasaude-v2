import { extractAttribution, normalizeWhatsapp, validateAndNormalizeCotacao } from '../lib/cotacao.ts';

export const QUOTE_WHATSAPP_URL = 'https://wa.me/552126400777';
const ATTRIBUTION_KEYS = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']);

export function quoteErrorMessage(code) {
  switch (code) {
    case 'invalid_lives_ages': return 'Confira a quantidade de vidas e as idades informadas.';
    case 'consent_required': return 'É necessário aceitar a Política de Privacidade para enviar.';
    case 'invalid_email': return 'Se quiser deixar o e-mail, use um endereço válido.';
    case 'invalid_whatsapp': return 'Informe um WhatsApp válido com DDD.';
    case 'rate_limited': return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
    default: return 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.';
  }
}

export function collectQuoteErrors({ contact, lives, ages }) {
  const errors = {};
  if (!Number.isInteger(lives) || lives < 1 || lives > 10 || ages.length !== lives || ages.some(age => age === '' || !Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 120)) errors.ages = quoteErrorMessage('invalid_lives_ages');
  if (contact.name.trim().length < 2 || contact.name.trim().length > 120) errors.name = 'Informe seu nome (2 a 120 caracteres).';
  if (contact.city.trim().length < 2 || contact.city.trim().length > 120) errors.city = 'Informe sua cidade (2 a 120 caracteres).';
  if (!normalizeWhatsapp(contact.whatsapp)) errors.whatsapp = quoteErrorMessage('invalid_whatsapp');
  if (contact.email.trim() && (contact.email.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))) errors.email = quoteErrorMessage('invalid_email');
  if (!contact.consent) errors.consent = quoteErrorMessage('consent_required');
  return errors;
}

function attributionUrl(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    for (const key of [...url.searchParams.keys()]) if (!ATTRIBUTION_KEYS.has(key)) url.searchParams.delete(key);
    return url.href;
  } catch { return undefined; }
}

export function quoteSource(pageUrl, referrer) {
  return extractAttribution({ pageUrl: attributionUrl(pageUrl) || '', referrer: attributionUrl(referrer) });
}

function safeErrorCode(status, body) {
  if (typeof body?.error === 'string' && /^[a-z0-9_]{1,64}$/.test(body.error)) return body.error;
  if (status === 429) return 'rate_limited';
  if (status === 400) return 'invalid_payload';
  if (status === 502 || status === 503) return 'unavailable';
  return 'server_error';
}

// One identity per unchanged request allows a retry after an uncertain network result.
export function createQuoteRequestSession({ fetchImpl = (...args) => fetch(...args), createUuid = () => crypto.randomUUID(), now = () => new Date().toISOString() } = {}) {
  let pending = false, signature = '', requestId = '', consentAt = '';
  return {
    get pending() { return pending; },
    reset() { if (!pending) { signature = ''; requestId = ''; consentAt = ''; } },
    async submit(input) {
      if (pending) return { status: 'busy' };
      const errors = collectQuoteErrors(input);
      if (Object.keys(errors).length) return { status: 'error', code: 'invalid_payload', errors };
      const fields = {
        name: input.contact.name, city: input.contact.city, email: input.contact.email.trim(), whatsapp: input.contact.whatsapp,
        livesCount: input.lives, ages: input.ages.map(Number), consent: input.contact.consent,
        source: quoteSource(input.pageUrl, input.referrer), website: input.website || '',
      };
      const nextSignature = JSON.stringify(fields);
      if (nextSignature !== signature) { signature = nextSignature; requestId = createUuid(); consentAt = now(); }
      const parsed = validateAndNormalizeCotacao({ ...fields, requestId, consentAt });
      if (!parsed.success) return { status: 'error', code: parsed.code, errors: {} };
      const payload = { ...parsed.data, email: parsed.data.email || '', website: fields.website };
      pending = true;
      try {
        const response = await fetchImpl('/api/cotacao', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        let body;
        try { body = await response.json(); } catch { body = null; }
        if (!response.ok || body?.ok !== true) return { status: 'error', code: safeErrorCode(response.status, body), errors: {} };
        signature = ''; requestId = ''; consentAt = '';
        return { status: 'success' };
      } catch { return { status: 'error', code: 'network', errors: {} }; }
      finally { pending = false; }
    },
  };
}
