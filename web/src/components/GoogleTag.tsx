"use client";

import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

/**
 * Google Tag Manager — base para Google Ads, GA4, remarketing e outras tags.
 *
 * Carregado condicionalmente: só renderiza se NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
 * estiver definida. Em dev local sem a var, o site funciona normalmente.
 *
 * Env var esperada:
 *   NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID   ex.: "GTM-PG8P67C7"
 */
export function GoogleTag() {
  if (!GTM_ID) return null;

  return (
    <>
      {/* GTM script principal — carrega antes da hidratação para capturar pageview */}
      <Script id="gtm-init" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      {/* Fallback noscript para browsers sem JavaScript */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
