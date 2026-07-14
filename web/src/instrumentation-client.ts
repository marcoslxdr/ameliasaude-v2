import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (token) {
  posthog.init(token, {
    api_host: host,
    // Keep defaults current with PostHog Next.js docs (LGPD-aware)
    defaults: "2026-05-30",
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: "identified_only",
    // Persist UTM for ads attribution (Google Ads)
    persistence: "localStorage+cookie",
    // Session recording — explicitly on for Amélia Saúde
    disable_session_recording: false,
    // Enable autocapture for clicks, inputs, etc.
    autocapture: true,
    // Cross-subdomain tracking (www.ameliasaude.com.br ↔ ameliasaude.com.br)
    cross_subdomain_cookie: true,
  });
}
