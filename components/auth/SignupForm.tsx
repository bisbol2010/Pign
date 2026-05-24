"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

const HAS_GOOGLE = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "1";
const HAS_APPLE = process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED === "1";

export function SignupForm() {
  const { signIn } = useAuthActions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      await signIn("password", {
        email: normalizedEmail,
        password,
        name: name.trim(),
        flow: "signUp",
      });
      // Full-page navigation (not router.push) so the freshly-set auth
      // cookie is included on the very next request and the middleware
      // doesn't bounce us back to /login.
      window.location.href = "/dashboard";
    } catch {
      setError("Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div>
        <label htmlFor="signup-name" className="block text-sm text-grey-3 mb-1.5">Full name</label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-grey-5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pign-black transition-colors"
          required
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="signup-email" className="block text-sm text-grey-3 mb-1.5">
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-grey-5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pign-black transition-colors"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm text-grey-3 mb-1.5">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-grey-5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pign-black transition-colors"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pign-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
      <p className="text-sm text-grey-3">
        Already have an account?{" "}
        <a href="/login" className="text-pign-black font-medium underline">
          Log in
        </a>
      </p>
      {(HAS_GOOGLE || HAS_APPLE) && (
        <div className="space-y-3 pt-2">
          {HAS_GOOGLE && (
            <button
              type="button"
              onClick={() => void signIn("google")}
              className="w-full border border-grey-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-grey-7 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          )}
          {HAS_APPLE && (
            <button
              type="button"
              onClick={() => void signIn("apple")}
              className="w-full border border-grey-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-grey-7 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
                <path d="M14.94 9.63c-.023-2.474 2.019-3.662 2.11-3.72-1.148-1.68-2.937-1.91-3.574-1.938-1.521-.154-2.97.896-3.741.896-.77 0-1.962-.873-3.224-.85-1.659.024-3.19.965-4.044 2.453-1.724 2.992-.441 7.427 1.238 9.857.82 1.188 1.8 2.523 3.085 2.476 1.237-.05 1.704-.8 3.2-.8 1.494 0 1.914.8 3.222.775 1.332-.024 2.176-1.211 2.99-2.403.942-1.379 1.33-2.714 1.354-2.783-.03-.013-2.597-0.997-2.622-3.955z" />
              <path d="M12.45 2.532C13.13 1.706 13.59.579 13.47-.534c-.973.04-2.15.648-2.848 1.465-.625.724-1.173 1.88-1.026 2.99 1.084.084 2.19-.55 2.855-1.389z" />
              </svg>
              Continue with Apple
            </button>
          )}
        </div>
      )}
    </form>
  );
}
