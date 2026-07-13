"use client";

import { useState, useEffect, useCallback } from "react";

export function useWaitingListModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      if (typeof window !== "undefined" && window.location.hash === "#lista-de-espera") {
        setIsOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const open = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.hash = "lista-de-espera";
      setIsOpen(true);
    }
  }, []);

  const close = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
      setIsOpen(false);
    }
  }, []);

  return { isOpen, open, close };
}
