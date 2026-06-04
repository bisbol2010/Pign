import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthIllustration } from "@/components/auth/AuthIllustration";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <AuthIllustration />
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            aria-label="Pign home"
            className="mb-8 inline-block rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pign-black focus-visible:ring-offset-2 lg:hidden"
          >
            <Image src="/pign-logo.svg" alt="Pign" width={72} height={32} />
          </Link>
          <h1 className="text-grey-3 text-2xl mb-1">Welcome Back!</h1>
          <h2 className="text-pign-black text-3xl font-semibold mb-8">
            Log in
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
