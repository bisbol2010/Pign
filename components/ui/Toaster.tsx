"use client";

import { Toaster as SonnerToaster } from "sonner";

/** App-wide toast host (SPEC.md — sonner). */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  );
}
