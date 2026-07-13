"use client";

import posthog from "posthog-js";

/* -------------------------------------------------------------------------- */
/*  PostHog                                                                   */
/* -------------------------------------------------------------------------- */

/** Safe capture wrapper — no-ops if PostHog is not initialized. */
export function track(event: string, properties?: Record<string, string | number | boolean | null | undefined>) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // never break UX for analytics
  }
}

export function trackContactClick(channel: string, href: string) {
  track("contact_channel_click", {
    channel,
    href,
    page: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

export function trackCtaClick(cta: string, href: string) {
  track("cta_click", {
    cta,
    href,
    page: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

/* -------------------------------------------------------------------------- */
/*  Google Ads Conversion Tracking                                            */
/* -------------------------------------------------------------------------- */

/**
 * Dispara um evento de conversão via Google Tag Manager (dataLayer push).
 *
 * A tag de conversão do Google Ads deve estar configurada no GTM
 * com trigger baseada no event `google_ads_conversion`.
 *
 * Pré-requisito: componente <GoogleTag /> deve estar no layout raiz e
 * NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID deve estar definida.
 */
export function trackGoogleAdsConversion() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID) return;

  const dl = (window as unknown as Record<string, unknown>).dataLayer as
    | Array<Record<string, unknown>>
    | undefined;

  if (!Array.isArray(dl)) return;

  try {
    dl.push({ event: "google_ads_conversion" });
  } catch {
    // never break UX for analytics
  }
}
