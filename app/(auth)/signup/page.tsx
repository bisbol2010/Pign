import { SignupForm } from "@/components/auth/SignupForm";
import { AuthIllustration } from "@/components/auth/AuthIllustration";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen">
      <AuthIllustration />
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-grey-3 text-2xl mb-1">Get Started</h1>
          <h2 className="text-pign-black text-3xl font-semibold mb-8">
            Create account
          </h2>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
