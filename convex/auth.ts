import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";
import Resend from "@auth/core/providers/resend";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password,
    Resend({
      from: process.env.AUTH_EMAIL_FROM ?? "Pign <onboarding@resend.dev>",
    }),
    Google,
    Apple,
  ],
});
