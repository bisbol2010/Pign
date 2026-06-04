"use client";

import { useEffect } from "react";
import { ErrorStateDuotone } from "@/components/illustrations";
import { Button } from "@/components/ui/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-[#F7F7F7] px-[30px] py-[60px] text-center">
      <div className="flex max-w-[400px] flex-col items-center">
        <ErrorStateDuotone className="mb-[32px] h-[120px] w-[120px] text-pign-black" />
        <h2 className="text-[24px] font-semibold text-pign-black">
          Something went wrong
        </h2>
        <p className="mt-[12px] text-[16px] leading-relaxed text-grey-2">
          An unexpected error occurred. Pign's safety protocol stopped the application from crashing.
        </p>
        {error.message && (
          <code className="mt-[16px] block max-w-full overflow-x-auto rounded-[4px] bg-grey-6 px-[12px] py-[8px] text-left text-[13px] text-grey-2">
            {error.message}
          </code>
        )}
        <div className="mt-[32px] flex items-center gap-[16px]">
          <Button variant="primary" size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="secondary" size="lg" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
}
