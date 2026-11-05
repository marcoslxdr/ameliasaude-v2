"use client";

import Script from "next/script";
import { MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import "./mosia-chat.css";

type MosiaEmbed = {
  on: (event: "UPDATE_STYLE", handler: (payload: { style?: { height?: string } }) => void) => void;
};

const containerId = "container-ms-AtendimentoViaChat-9999.0007";
const bundle = "MTAwLjExNi40OC4xMDEuMTEzLjExMS40OC4xMTEuMTEzLjEwMC4xMDcuMTEwLjEwMy4xMTcuOTkuMTE5LjEwMi4xMDMuNDguOTkuMTExLjEwMy4xMTAuMTA3Ljk5LjExNy45OS4xMTkuMTAyLjEwMy4=";

declare global {
  interface Window {
    omnichannelSDK?: { embed: (options: object) => MosiaEmbed | false };
  }
}

export function MosiaChat() {
  const initialized = useRef(false);
  const [collapsed, setCollapsed] = useState(false);
  return <>
    <div className="mosia-chat" data-collapsed={collapsed}>
      <div id={containerId} />
      {collapsed && <span className="mosia-launcher-icon" aria-hidden="true"><MessageCircle size={26} /></span>}
    </div>
    <Script src="https://omnichannel-sdk.mosiaomnichannel.com.br/" strategy="afterInteractive" onReady={() => {
      if (initialized.current || !window.omnichannelSDK) return;
      const chat = window.omnichannelSDK.embed({
        id: containerId,
        url: "https://chat.mosiaomnichannel.com.br",
        json: { floatStyle: { right: "20px", bottom: "20px" }, configuration: { flutuante: true, idFuncionalidade: "9999.0007", bundle, authorization: null, esquemaCor: null } },
      });
      if (!chat) return;
      const frame = document.getElementById(containerId)?.querySelector("iframe");
      frame?.setAttribute("title", "Atendimento por chat da Amélia Saúde");
      chat.on("UPDATE_STYLE", ({ style }) => {
        if (style?.height) setCollapsed(style.height === "50px");
      });
      initialized.current = true;
    }} />
  </>;
}
