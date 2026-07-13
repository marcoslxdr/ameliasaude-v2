import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (token) {
  posthog.init(token, {
    api_host: host,
    // Keep defaults current with PostHog Next.js docs
    defaults: "2026-05-30",
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: "identified_only",
    // Persist UTM for ads attribution (Google Ads Search launch)
    persistence: "localStorage+cookie",
  });
}
