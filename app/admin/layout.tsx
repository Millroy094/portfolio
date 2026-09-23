"use client";

import { getCurrentUser, fetchUserAttributes, signOut, type AuthUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Loader2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const displayName = email ?? user?.signInDetails?.loginId ?? user?.username ?? "Unknown user";

  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  useEffect(() => {
    // `getCurrentUser` may still reject mid-OAuth-callback even though
    // sign-in is about to succeed, so rely on Hub for "signedIn" /
    // "signInWithRedirect_failure" instead of bouncing early.
    let cancelled = false;

    // Cognito surfaces failures (bad issuer, missing attributes, etc.) as
    // `/admin?error=...&error_description=...`. Log it and forward to
    // /login so it's visible instead of silently redirecting away.
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (oauthError) {
      const description = params.get("error_description") ?? oauthError;
      console.error("OAuth callback error on /admin:", description);
      router.replace(`/login?error=${encodeURIComponent(description)}`);
      return;
    }

    const checkUser = async () => {
      try {
        const current = await getCurrentUser();
        if (!cancelled) {
          setUser(current);
          setChecking(false);
        }
        // Amplify's own cleanup uses a raw `window.history.replaceState`,
        // which Next's App Router isn't aware of and can later resync back
        // to the dirty URL (e.g. on HMR/refresh). Use `router.replace`
        // instead. Also covers the exchange itself failing (stale/reused code).
        const currentParams = new URLSearchParams(window.location.search);
        if (currentParams.has("code") || currentParams.has("state")) {
          router.replace(window.location.pathname);
        }
        try {
          const attributes = await fetchUserAttributes();
          if (!cancelled && attributes.email) setEmail(attributes.email);
        } catch (err) {
          console.error("Failed to fetch user attributes:", err);
        }
      } catch {
        const hasOAuthCode = new URLSearchParams(window.location.search).has("code");
        if (!hasOAuthCode && !cancelled) {
          router.replace("/login");
        }
      }
    };

    checkUser();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        checkUser();
      }
      if (payload.event === "signInWithRedirect_failure") {
        console.error("signInWithRedirect failed on /admin:", payload.data?.error);
        if (!cancelled) router.replace("/login?error=oauth_failed");
      }
      if (payload.event === "signedOut") {
        if (!cancelled) router.replace("/login");
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  const isDark = theme === "dark";

  if (checking) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${isDark ? "bg-black" : "bg-neutral-50"}`}
      >
        <Loader2
          className={`h-8 w-8 animate-spin ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "admin-theme-dark bg-black text-white" : "admin-theme-light bg-neutral-50 text-neutral-950"}`}
    >
      <header
        className={`w-full ${isDark ? "bg-linear-to-b from-neutral-900/60 to-black border-neutral-800/40" : "bg-white border-neutral-200"} border-b shadow-lg`}
      >
        <div className="mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4">
          <div className="text-center sm:text-left">
            <div
              className={`inline-block px-4 py-2 border rounded-lg ${
                isDark
                  ? "border-neutral-700/50 bg-neutral-900/50"
                  : "border-neutral-300/60 bg-neutral-100/80"
              }`}
            >
              <span
                className={`text-sm tracking-wide ${
                  isDark ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Welcome{" "}
                <strong className={isDark ? "text-neutral-100" : "text-neutral-900"}>
                  {displayName}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`h-10 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  : "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
              }`}
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold
          text-center w-full sm:w-auto transition-colors h-10 flex items-center justify-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isDark
              ? "bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 text-white focus-visible:ring-neutral-500/70 focus-visible:ring-offset-black"
              : "bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-500 text-neutral-950 focus-visible:ring-neutral-400/70 focus-visible:ring-offset-neutral-50"
          }
        `}
              href="/"
            >
              View Changes
            </Link>

            <button
              type="button"
              onClick={async () => {
                setSigningOut(true);
                try {
                  await signOut();
                } catch (err) {
                  console.error("Sign out failed:", err);
                } finally {
                  router.replace("/login");
                }
              }}
              disabled={signingOut}
              className={`h-10 px-4 rounded-lg text-sm font-semibold transition-colors
          disabled:opacity-70 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isDark
              ? "bg-neutral-100 text-black hover:bg-neutral-200 focus-visible:ring-neutral-300/70 focus-visible:ring-offset-black"
              : "bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:ring-neutral-700/70 focus-visible:ring-offset-neutral-50"
          }
        `}
            >
              {signingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
