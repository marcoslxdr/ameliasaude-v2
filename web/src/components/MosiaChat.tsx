"use client";

import Script from "next/script";
import { useRef } from "react";

const containerId = "container-ms-AtendimentoViaChat-9999.0007";
const bundle = "MTAwLjExNi40OC4xMDEuMTEzLjExMS40OC4xMTEuMTEzLjEwMC4xMDcuMTEwLjEwMy4xMTcuOTkuMTE5LjEwMi4xMDMuNDguOTkuMTExLjEwMy4xMTAuMTA3Ljk5LjExNy45OS4xMTkuMTAyLjEwMy4=";

declare global {
  interface Window {
    omnichannelSDK?: { embed: (options: object) => unknown };
  }
}

export function MosiaChat() {
  const initialized = useRef(false);
  return <>
    <div id={containerId} />
    <Script src="https://omnichannel-sdk.mosiaomnichannel.com.br/" strategy="afterInteractive" onReady={() => {
      if (initialized.current || !window.omnichannelSDK) return;
      window.omnichannelSDK.embed({
        id: containerId,
        url: "https://chat.mosiaomnichannel.com.br",
        json: { configuration: { flutuante: true, idFuncionalidade: "9999.0007", bundle, authorization: null, esquemaCor: null } },
      });
      initialized.current = true;
    }} />
  </>;
}
