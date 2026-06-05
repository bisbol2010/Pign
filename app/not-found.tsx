"use client";

import Link from "next/link";
import { ShredderIllustration } from "@/components/illustrations";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-[#F7F7F7] px-[30px] py-[60px] text-center">
      <div className="flex max-w-[400px] flex-col items-center">
        <ShredderIllustration className="mb-[32px] h-[120px] w-[120px] text-pign-black" />
        <h2 className="text-[24px] font-semibold text-pign-black">
          Page not found
        </h2>
        <p className="mt-[12px] text-[16px] leading-relaxed text-grey-2">
          The document or location you are looking for does not exist or has been permanently shredded.
        </p>
        <Link href="/" className="mt-[32px]">
          <Button variant="primary" size="lg">
            Back to Pign
          </Button>
        </Link>
      </div>
    </div>
  );
}
