import { z } from "zod";

/** Documented CRM default. Runtime always requires `CRM_LEADS_ENDPOINT`. */
export const DOCUMENTED_CRM_LEADS_ENDPOINT =
  "https://crmamelia.vercel.app/api/public/leads";

export const MAX_LIVES_COUNT = 11;
export const MIN_AGE = 0;
export const MAX_AGE = 120;

const BRAZIL_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

const ATTRIBUTION_QUERY_TO_FIELD = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  gclid: "gclid",
  fbclid: "fbclid",
} as const;

type AttributionField =
  (typeof ATTRIBUTION_QUERY_TO_FIELD)[keyof typeof ATTRIBUTION_QUERY_TO_FIELD];

export type CotacaoErrorCode =
  | "invalid_payload"
  | "invalid_lives_ages"
  | "consent_required"
  | "invalid_email"
  | "invalid_whatsapp"
  | "invalid_request_id"
  | "invalid_source";

export type CotacaoSource = {
  pageUrl: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
};

export type CrmLeadPayload = {
  requestId: string;
  name: string;
  city: string;
  email: string | null;
  whatsapp: string;
  livesCount: number;
  ages: number[];
  consent: true;
  consentAt: string;
  source: CotacaoSource;
};

export type CotacaoResult =
  | { success: true; data: CrmLeadPayload }
  | { success: false; code: CotacaoErrorCode; message: string };

const optionalAttr = z.string().trim().min(1).max(200).optional();

const sourceSchema = z.object({
  pageUrl: z.string().trim().url().max(2048),
  referrer: z.string().trim().max(2048).optional(),
  utmSource: optionalAttr,
  utmMedium: optionalAttr,
  utmCampaign: optionalAttr,
  utmContent: optionalAttr,
  utmTerm: optionalAttr,
  gclid: optionalAttr,
  fbclid: optionalAttr,
});

const inputSchema = z.object({
  requestId: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  email: z
    .union([
      z.literal(""),
      z.string().trim().toLowerCase().email().max(255),
    ])
    .optional(),
  whatsapp: z.string().min(1).max(40),
  livesCount: z.coerce.number().int().min(1).max(MAX_LIVES_COUNT),
  ages: z.array(z.coerce.number().int().min(MIN_AGE).max(MAX_AGE)),
  consent: z.literal(true),
  consentAt: z.string().datetime(),
  source: sourceSchema,
});

function sanitizeAttr(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const cleaned = value.trim().slice(0, 200);
  if (!cleaned) return undefined;
  if (/[\u0000-\u001F]/.test(cleaned)) return undefined;
  return cleaned;
}

export function extractAttribution(input: {
  pageUrl: string;
  referrer?: string | null;
  explicit?: Partial<Omit<CotacaoSource, "pageUrl" | "referrer">> | null;
}): CotacaoSource {
  const source: CotacaoSource = { pageUrl: input.pageUrl };

  const referrer = input.referrer?.trim();
  if (referrer) {
    try {
      const parsed = new URL(referrer);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        source.referrer = referrer.slice(0, 2048);
      }
    } catch {
      // omit invalid referrer
    }
  }

  try {
    const url = new URL(input.pageUrl);
    for (const [queryKey, field] of Object.entries(ATTRIBUTION_QUERY_TO_FIELD)) {
      const value = sanitizeAttr(url.searchParams.get(queryKey));
      if (value) source[field as AttributionField] = value;
    }
  } catch {
    // pageUrl is validated by the schema before CRM forward
  }

  const explicit = input.explicit;
  if (explicit) {
    for (const field of Object.values(ATTRIBUTION_QUERY_TO_FIELD)) {
      const value = sanitizeAttr(explicit[field]);
      if (value) source[field] = value;
    }
  }

  return source;
}

export function formatWhatsappInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 13);
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  if (local.length === 0) return "";
  if (local.length <= 2) return `(${local}`;
  if (local.length <= 6) return `(${local.slice(0, 2)}) ${local.slice(2)}`;
  if (local.length <= 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7, 11)}`;
}

export function normalizeWhatsapp(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("550") && (digits.length === 13 || digits.length === 14)) {
    digits = `55${digits.slice(3)}`;
  }

  if (digits.startsWith("0") && (digits.length === 11 || digits.length === 12)) {
    digits = digits.slice(1);
  }

  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  if (!digits.startsWith("55") || (digits.length !== 12 && digits.length !== 13)) {
    return null;
  }

  const ddd = Number(digits.slice(2, 4));
  if (!BRAZIL_DDDS.has(ddd)) return null;

  const subscriber = digits.slice(4);
  if (subscriber.length === 9 && !subscriber.startsWith("9")) return null;

  return digits;
}

export function isHoneypotTriggered(input: unknown): boolean {
  if (!input || typeof input !== "object") return false;
  const website = (input as { website?: unknown }).website;
  if (website == null) return false;
  if (typeof website === "string") return website.trim().length > 0;
  return true;
}

function mapZodError(error: z.ZodError): CotacaoErrorCode {
  const paths = error.issues.map((issue) => issue.path.map(String).join("."));
  if (paths.some((path) => path === "consent")) return "consent_required";
  if (paths.some((path) => path === "email")) return "invalid_email";
  if (paths.some((path) => path === "whatsapp")) return "invalid_whatsapp";
  if (paths.some((path) => path === "requestId")) return "invalid_request_id";
  if (paths.some((path) => path === "ages" || path.startsWith("ages.") || path === "livesCount")) {
    return "invalid_lives_ages";
  }
  if (paths.some((path) => path === "source" || path.startsWith("source."))) {
    return "invalid_source";
  }
  return "invalid_payload";
}

export function validateAndNormalizeCotacao(input: unknown): CotacaoResult {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      code: mapZodError(parsed.error),
      message: "Dados inválidos.",
    };
  }

  if (parsed.data.ages.length !== parsed.data.livesCount) {
    return {
      success: false,
      code: "invalid_lives_ages",
      message: "Quantidade de vidas e idades não conferem.",
    };
  }

  const whatsapp = normalizeWhatsapp(parsed.data.whatsapp);
  if (!whatsapp) {
    return {
      success: false,
      code: "invalid_whatsapp",
      message: "WhatsApp inválido.",
    };
  }

  const source = extractAttribution({
    pageUrl: parsed.data.source.pageUrl,
    referrer: parsed.data.source.referrer,
    explicit: parsed.data.source,
  });

  return {
    success: true,
    data: {
      requestId: parsed.data.requestId,
      name: parsed.data.name,
      city: parsed.data.city,
      email: parsed.data.email ? parsed.data.email : null,
      whatsapp,
      livesCount: parsed.data.livesCount,
      ages: parsed.data.ages,
      consent: true,
      consentAt: parsed.data.consentAt,
      source,
    },
  };
}
