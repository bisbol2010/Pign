import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Toaster } from "@/components/ui/Toaster";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pign - Your Secure Digital Mailbox",
  description:
    "Store, organise, and access your important documents securely. Pign is your go-to place for official documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={`${bricolage.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-sans">
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
