"use client";

import { WaitingListModal } from "@/components/modals/WaitingListModal";
import { useWaitingListModal } from "@/hooks/useWaitingListModal";

export function WaitingListModalWrapper() {
  const { isOpen, close } = useWaitingListModal();
  return <WaitingListModal isOpen={isOpen} onClose={close} />;
}
