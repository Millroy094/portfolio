"use client";

import { getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Loader2, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) console.error("OAuth error on /login:", oauthError);
    return oauthError;
  });

  useEffect(() => {
    let cancelled = false;

    router.prefetch("/admin");

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        router.replace("/admin");
      }
      if (payload.event === "signInWithRedirect_failure") {
        console.error("signInWithRedirect failed:", payload.data?.error);
        if (!cancelled) {
          setError("Sign in failed. Please try again.");
          setStarting(false);
        }
      }
    });

    (async () => {
      try {
        // Already signed in (e.g. back button after auth) - skip the button.
        await getCurrentUser();
        if (!cancelled) router.replace("/admin");
      } catch {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  const handleSignIn = async () => {
    setError(null);
    setStarting(true);
    try {
      await signInWithRedirect({
        provider: { custom: process.env.NEXT_PUBLIC_OIDC_PROVIDER_NAME ?? "Auth" },
      });
    } catch (redirectError) {
      console.error("signInWithRedirect threw:", redirectError);
      setError("Could not start sign in. Please try again.");
      setStarting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-4 text-white">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-neutral-800/60 bg-neutral-900/40 px-8 py-10 text-center shadow-xl">
        <Image src="/logo.svg" alt="Logo" width={64} height={64} priority />

        <div>
          <h1 className="text-xl font-semibold text-neutral-100">Admin Sign In</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Sign in with SSO to manage your portfolio content.
          </p>
        </div>

        {checking ? (
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
        ) : (
          <div className="flex w-full flex-col items-center gap-4">
            {error && (
              <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleSignIn}
              disabled={starting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {starting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {starting ? "Redirecting..." : "Sign in with SSO"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
