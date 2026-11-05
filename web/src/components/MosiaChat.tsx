"use client";

import Script from "next/script";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./mosia-chat.css";

const containerId = "container-ms-AtendimentoViaChat-9999.0007";
const bundle = "MTAwLjExNi40OC4xMDEuMTEzLjExMS40OC4xMTEuMTEzLjEwMC4xMDcuMTEwLjEwMy4xMTcuOTkuMTE5LjEwMi4xMDMuNDguOTkuMTExLjEwMy4xMTAuMTA3Ljk5LjExNy45OS4xMTkuMTAyLjEwMy4=";

declare global {
  interface Window {
    omnichannelSDK?: { embed: (options: object) => object | false };
  }
}

export function MosiaChat() {
  const panel = useRef<HTMLDialogElement>(null);
  const initialized = useRef(false);
  const [opened, setOpened] = useState(false);
  const [started, setStarted] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!started || !sdkReady || initialized.current) return;
    const chat = window.omnichannelSDK?.embed({
      id: containerId,
      url: "https://chat.mosiaomnichannel.com.br",
      json: { configuration: { flutuante: false, idFuncionalidade: "9999.0007", bundle, authorization: null, esquemaCor: null } },
    });
    if (!chat) {
      setFailed(true);
      return;
    }
    initialized.current = true;
    const frame = document.getElementById(containerId)?.querySelector("iframe");
    frame?.setAttribute("title", "Conversa com o atendimento Amélia Saúde");
  }, [sdkReady, started]);

  function showChat() {
    panel.current?.showModal();
    setOpened(true);
    setStarted(true);
  }

  return <>
    <button className="mosia-launcher" type="button" aria-label="Abrir chat de atendimento" aria-haspopup="dialog"
      aria-expanded={opened} aria-controls="mosia-panel" onClick={showChat}>
      <MessageCircle size={26} aria-hidden="true" />
    </button>
    <dialog ref={panel} id="mosia-panel" className="mosia-panel" aria-labelledby="mosia-heading" onClose={() => setOpened(false)}>
      <div className="mosia-panel-heading">
        <h2 id="mosia-heading">Atendimento Amélia Saúde</h2>
        <button type="button" aria-label="Fechar chat" onClick={() => panel.current?.close()}><X size={20}/></button>
      </div>
      <div id={containerId} className="mosia-content">
        {failed && <p role="status">O chat está indisponível no momento.</p>}
      </div>
      <a className="mosia-central" href="tel:08000210777">Ligar para a Central · 0800 021 0777</a>
    </dialog>
    {started && <Script src="https://omnichannel-sdk.mosiaomnichannel.com.br/" strategy="afterInteractive"
      onReady={() => setSdkReady(true)} onError={() => setFailed(true)}/>}
  </>;
}
