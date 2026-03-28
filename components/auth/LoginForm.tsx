"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export function LoginForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [magicEmail, setMagicEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicMessage, setMagicMessage] = useState("");
  const [magicError, setMagicError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const normalized = email.trim().toLowerCase();
      await signIn("password", {
        email: normalized,
        password,
        flow: "signIn",
      });
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMagicError("");
    setMagicMessage("");
    const trimmed = magicEmail.trim().toLowerCase();
    if (!trimmed) {
      setMagicError("Enter your email address.");
      return;
    }
    setMagicLoading(true);
    try {
      const formData = new FormData();
      formData.set("email", trimmed);
      await signIn("resend", formData);
      setMagicMessage(
        "Check your inbox — we sent a sign-in link to that address."
      );
      setMagicEmail("");
    } catch {
      setMagicError(
        "Could not send the email. Add AUTH_RESEND_KEY in Convex (see docs) or try again."
      );
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm text-grey-3 mb-1.5">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-grey-5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pign-black transition-colors"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm text-grey-3 mb-1.5">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-grey-5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pign-black transition-colors"
            required
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pign-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm text-grey-3">
          New here?{" "}
          <a href="/signup" className="text-pign-black font-medium underline">
            Create an account
          </a>
        </p>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-grey-6" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-grey-3">Or sign in with email</span>
        </div>
      </div>

      <form onSubmit={handleMagicLink} className="space-y-3">
        <p className="text-xs text-grey-3 leading-relaxed">
          We&apos;ll email you a one-time link — no password needed.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-4 pointer-events-none"
            />
            <input
              type="email"
              value={magicEmail}
              onChange={(e) => setMagicEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-grey-5 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-pign-black"
              autoComplete="email"
              aria-label="Email for magic link"
            />
          </div>
          <button
            type="submit"
            disabled={magicLoading}
            className="shrink-0 bg-grey-7 text-pign-black px-4 py-2.5 rounded-lg text-sm font-medium border border-grey-6 hover:bg-grey-6 transition-colors disabled:opacity-50"
          >
            {magicLoading ? "Sending…" : "Send link"}
          </button>
        </div>
        {magicMessage && (
          <p className="text-sm text-grey-2 bg-grey-7 rounded-lg px-3 py-2">
            {magicMessage}
          </p>
        )}
        {magicError && (
          <p className="text-sm text-red-600">{magicError}</p>
        )}
      </form>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => void signIn("google")}
          className="w-full border border-grey-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-grey-7 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => void signIn("apple")}
          className="w-full border border-grey-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-grey-7 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M14.94 9.63c-.023-2.474 2.019-3.662 2.11-3.72-1.148-1.68-2.937-1.91-3.574-1.938-1.521-.154-2.97.896-3.741.896-.77 0-1.962-.873-3.224-.85-1.659.024-3.19.965-4.044 2.453-1.724 2.992-.441 7.427 1.238 9.857.82 1.188 1.8 2.523 3.085 2.476 1.237-.05 1.704-.8 3.2-.8 1.494 0 1.914.8 3.222.775 1.332-.024 2.176-1.211 2.99-2.403.942-1.379 1.33-2.714 1.354-2.783-.03-.013-2.597-0.997-2.622-3.955z" />
            <path d="M12.45 2.532C13.13 1.706 13.59.579 13.47-.534c-.973.04-2.15.648-2.848 1.465-.625.724-1.173 1.88-1.026 2.99 1.084.084 2.19-.55 2.855-1.389z" />
          </svg>
          Continue with Apple
        </button>
      </div>
    </div>
  );
}
