"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CotacaoForm } from "@/components/sections/CotacaoForm";

type CotacaoContextType = {
  open: () => void;
};

const CotacaoContext = createContext<CotacaoContextType>({ open: () => {} });

export function useCotacao() {
  return useContext(CotacaoContext);
}

export function CotacaoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value: CotacaoContextType = {
    open: () => setIsOpen(true),
  };

  const close = () => setIsOpen(false);

  return (
    <CotacaoContext.Provider value={value}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[820px] rounded-3xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--amelia-deep)] shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--amelia-purple)]"
              aria-label="Fechar formulário de cotação"
            >
              ✕
            </button>

            {/* Modal content - reuse the form, adjust for modal */}
            <div className="max-h-[85vh] overflow-auto">
              <div className="p-6 sm:p-8">
                <div className="mb-4">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--amelia-purple)]">
                    Cotação rápida
                  </span>
                </div>
                {/* The form component, but we render a compact version by overriding some styles if needed */}
                <CotacaoForm compact />
              </div>
            </div>
          </div>
        </div>
      )}
    </CotacaoContext.Provider>
  );
}
