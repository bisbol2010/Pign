"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { VerifiedIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

type Step = "uploaded" | "details" | "confirm";

type VerifyFileModalProps = {
  documentId: Id<"documents"> | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function VerifyFileModal({
  documentId,
  open,
  onClose,
  onSuccess,
}: VerifyFileModalProps) {
  const doc = useQuery(
    api.documents.getById,
    documentId ? { id: documentId } : "skip"
  );
  const entities = useQuery(api.verification.listMyIssuerEntities);
  const submit = useMutation(api.verification.submitVerification);

  const [step, setStep] = useState<Step>("uploaded");
  const [description, setDescription] = useState("");
  const [issuerEntityId, setIssuerEntityId] = useState<
    Id<"verifiedEntities"> | ""
  >("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("uploaded");
    setDescription("");
    setIssuerEntityId("");
    setError(null);
  }, [open, documentId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !documentId) return null;

  // Guard against rendering the form before the document resolves. While it is
  // loading we show a spinner; if it cannot be found we say so instead of
  // displaying a placeholder "Document" name.
  if (doc === undefined || doc === null) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-pign-black/40 p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Verify file"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[480px] bg-white p-[40px] text-center shadow-[0_0_7px_0_#B3B3B3]"
          onClick={(e) => e.stopPropagation()}
        >
          {doc === undefined ? (
            <>
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
              <p className="mt-5 text-[16px] text-grey-2">Loading file…</p>
            </>
          ) : (
            <>
              <p className="text-[18px] font-medium text-pign-black">
                File not found
              </p>
              <p className="mt-2 text-[14px] text-grey-3">
                This document may have been moved or deleted.
              </p>
              <Button className="mt-6" size="lg" onClick={onClose}>
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  const { name, ext } = splitName(doc.name);

  const handleVerify = async () => {
    if (!documentId) return;
    setSubmitting(true);
    setError(null);
    try {
      await submit({
        id: documentId,
        description: description.trim() || undefined,
        issuerEntityId: issuerEntityId || undefined,
      });
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Verification failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-pign-black/40 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-file-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto bg-white shadow-[0_0_7px_0_#B3B3B3]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-grey-6 px-[30px] py-[20px]">
          <h2
            id="verify-file-title"
            className="text-[24px] font-medium text-pign-black"
          >
            Verify file
          </h2>
          <p className="mt-1 text-[16px] text-grey-2">
            Fill the form below to get your file verified
          </p>
        </div>

        <div className="px-[30px] py-[24px]">
          <VerifyStepper step={step} onStepChange={setStep} />

          {step === "uploaded" && (
            <div className="mt-[32px] rounded border border-grey-6 bg-grey-7/60 p-[24px] text-center">
              <VerifiedIcon size={40} className="mx-auto text-grey-3" />
              <p className="mt-4 text-[16px] text-pign-black">
                <span className="font-medium">{name}</span>
                <span className="text-grey-4">{ext}</span> is ready to verify.
              </p>
              <Button
                className="mt-6"
                size="lg"
                onClick={() => setStep("details")}
              >
                Continue
              </Button>
            </div>
          )}

          {step === "details" && (
            <div className="mt-[32px] flex flex-col gap-[32px] lg:flex-row">
              <div className="flex-1 space-y-5 bg-grey-7/60 p-[20px] sm:p-[32px]">
                <div>
                  <label className="text-[14px] text-grey-2">File name</label>
                  <p className="mt-1 text-[16px] text-pign-black">
                    <span className="font-medium">{name}</span>
                    <span className="text-grey-4">{ext}</span>
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="verify-description"
                    className="text-[14px] text-grey-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="verify-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 w-full resize-none border border-grey-5 bg-white px-3 py-2 text-[16px] text-pign-black outline-none focus:border-pign-black"
                    placeholder="Optional notes for this verification"
                  />
                </div>
                {entities && entities.length > 0 && (
                  <div>
                    <label
                      htmlFor="verify-entity"
                      className="text-[14px] text-grey-2"
                    >
                      Issue on behalf of (optional)
                    </label>
                    <select
                      id="verify-entity"
                      value={issuerEntityId}
                      onChange={(e) =>
                        setIssuerEntityId(
                          e.target.value as Id<"verifiedEntities"> | ""
                        )
                      }
                      className="mt-1 w-full border border-grey-5 bg-white px-3 py-2 text-[16px] text-pign-black outline-none focus:border-pign-black"
                    >
                      <option value="">Personal (self)</option>
                      {entities.map((ent) => (
                        <option key={ent._id} value={ent._id}>
                          {ent.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {error && (
                  <p className="text-[14px] text-verify-red" role="alert">
                    {error}
                  </p>
                )}
                <div className="flex items-center gap-6 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[16px] text-pign-black hover:underline"
                  >
                    Cancel
                  </button>
                  <Button size="lg" onClick={() => setStep("confirm")}>
                    Continue
                  </Button>
                </div>
              </div>
              <aside className="w-full border border-grey-6 p-[20px] sm:p-[28px] lg:max-w-[320px]">
                <h3 className="text-[16px] font-medium text-grey-2">
                  About Verification
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-grey-2">
                  Pign fingerprints your document and locks it to you (or your
                  verified entity). Anyone you share with can confirm it is the
                  genuine, unaltered original.
                </p>
              </aside>
            </div>
          )}

          {step === "confirm" && (
            <div className="mt-[32px] bg-grey-7/60 p-[24px]">
              <p className="text-[16px] text-pign-black">
                Confirm verification for{" "}
                <span className="font-medium">{name}</span>
                <span className="text-grey-4">{ext}</span>
                {description.trim() ? (
                  <>
                    {" "}
                    with note: &ldquo;{description.trim()}&rdquo;
                  </>
                ) : null}
                .
              </p>
              {error && (
                <p className="mt-3 text-[14px] text-verify-red" role="alert">
                  {error}
                </p>
              )}
              <div className="mt-8 flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-[16px] text-pign-black hover:underline"
                >
                  Back
                </button>
                <Button
                  size="lg"
                  disabled={submitting}
                  onClick={() => void handleVerify()}
                >
                  {submitting ? "Verifying…" : "Verify"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VerifyStepper({
  step,
  onStepChange,
}: {
  step: Step;
  onStepChange: (s: Step) => void;
}) {
  const steps: { id: Step; label: string; num: number }[] = [
    { id: "uploaded", label: "Uploaded", num: 1 },
    { id: "details", label: "File details", num: 2 },
    { id: "confirm", label: "Verify", num: 3 },
  ];
  const currentIdx = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex w-full items-start justify-between">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.id} className="relative flex flex-1 flex-col items-center text-center">
            {/* Connector Line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-[50%] right-[-50%] top-5 h-[2px] -translate-y-1/2 z-0",
                  i < currentIdx ? "bg-pign-black" : "bg-grey-6"
                )}
              />
            )}
            
            {/* Button wrapping Step Circle and Label */}
            <button
              type="button"
              disabled={i > currentIdx}
              onClick={() => {
                if (i <= currentIdx) onStepChange(s.id);
              }}
              className="relative z-10 flex flex-col items-center gap-[12px] focus:outline-none disabled:cursor-default"
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-semibold transition-all duration-200 shadow-sm",
                  done && "bg-pign-black text-white",
                  active && !done && "border-2 border-pign-black bg-white text-pign-black font-bold scale-105",
                  !done && !active && "border border-grey-5 bg-grey-7 text-grey-3"
                )}
              >
                {done ? "✓" : s.num}
              </span>
              <span
                className={cn(
                  "text-[14px] font-medium whitespace-nowrap",
                  active || done ? "text-pign-black font-semibold" : "text-grey-3"
                )}
              >
                {s.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function splitName(full: string) {
  const lastDot = full.lastIndexOf(".");
  return lastDot > 0
    ? { name: full.substring(0, lastDot), ext: full.substring(lastDot) }
    : { name: full, ext: "" };
}
