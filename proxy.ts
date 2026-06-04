import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login",
  "/signup",
  "/about",
  "/pricing",
  "/terms",
  "/privacy",
  "/help",
  // Public share links must be viewable while signed out (the page shows a
  // "Sign in to view" screen for protected shares).
  "/s/:token*",
]);

// Auth pages that a signed-in user should be bounced away from. Other public
// pages (pricing, help, about, terms, privacy) stay reachable while signed in
// so the in-app upgrade / info flows work.
const isAuthOnlyEntry = createRouteMatcher(["/login", "/signup"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthed = await convexAuth.isAuthenticated();
  const isPublic = isPublicRoute(request);

  if (!isPublic && !isAuthed) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
  if (isAuthed && isAuthOnlyEntry(request)) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
