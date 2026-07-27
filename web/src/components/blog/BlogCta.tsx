"use client";

import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

export function BlogCta({
  label,
  href,
  event,
  slug,
}: {
  label: string;
  href: string;
  event: string;
  slug: string;
}) {
  return (
    <Button
      href={href}
      variant="primary"
      onClick={() =>
        track(event, {
          post_slug: slug,
          source: "blog",
          cta_label: label,
          href,
        })
      }
    >
      {label}
    </Button>
  );
}
