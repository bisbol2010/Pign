import { LoginForm } from "@/components/auth/LoginForm";
import { AuthIllustration } from "@/components/auth/AuthIllustration";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <AuthIllustration />
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
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
