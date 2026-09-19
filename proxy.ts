import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextResponse } from "next/server";

import { runWithAmplifyServerContext } from "@/services/amplify/amplifyServer";

import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch {
        return false;
      }
    },
  });

  // Cognito redirects back to `/admin?code=...&state=...` on success or
  // `/admin?error=...&error_description=...&state=...` on failure. Either
  // way, handling only happens client-side and there's no auth cookie yet,
  // so let this one request through instead of bouncing to /login.
  const isOAuthCallback =
    request.nextUrl.searchParams.has("state") &&
    (request.nextUrl.searchParams.has("code") || request.nextUrl.searchParams.has("error"));

  if (!authenticated && request.nextUrl.pathname.startsWith("/admin") && !isOAuthCallback) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authenticated && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
