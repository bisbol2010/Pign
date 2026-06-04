"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { VerifyFileModal } from "./VerifyFileModal";

type VerificationContextValue = {
  openVerify: (documentId: Id<"documents">) => void;
  closeVerify: () => void;
};

const VerificationContext = createContext<VerificationContextValue | null>(
  null
);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [documentId, setDocumentId] = useState<Id<"documents"> | null>(null);

  const openVerify = useCallback((id: Id<"documents">) => {
    setDocumentId(id);
  }, []);

  const closeVerify = useCallback(() => setDocumentId(null), []);

  const value = useMemo(
    () => ({ openVerify, closeVerify }),
    [openVerify, closeVerify]
  );

  return (
    <VerificationContext.Provider value={value}>
      {children}
      <VerifyFileModal
        documentId={documentId}
        open={documentId !== null}
        onClose={closeVerify}
      />
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const ctx = useContext(VerificationContext);
  if (!ctx) {
    throw new Error(
      "useVerification must be used within VerificationProvider"
    );
  }
  return ctx;
}

/** Safe hook when provider may be absent (e.g. marketing pages). */
export function useVerificationOptional() {
  return useContext(VerificationContext);
}
