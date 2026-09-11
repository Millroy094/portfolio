"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const { user, route } = useAuthenticator((context) => [context.user, context.route]);

  const username = user?.signInDetails?.loginId ?? user?.username ?? "Unknown user";

  useEffect(() => {
    (async () => {
      try {
        await getCurrentUser();
        setChecking(false);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      }
    })();
  }, [router]);

  if (checking) return null;

  return (
    <div className="bg-black min-h-screen text-white">
      <header className="w-full bg-linear-to-b from-neutral-900/60 to-black border-b border-neutral-800/40 shadow-lg">
        <div className="mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4">
          <div className="text-center sm:text-left">
            <div className="inline-block px-4 py-2 border border-neutral-700/50 rounded-lg bg-neutral-900/50">
              <span className="text-sm tracking-wide text-neutral-200">
                Welcome <strong className="text-neutral-100">{username}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2">
            <Link
              className="
          bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500
          text-white px-4 py-2 rounded-lg text-sm font-semibold
          text-center w-full sm:w-auto transition-colors h-10 flex items-center justify-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        "
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
                } finally {
                  if (route !== "signIn") window.location.href = "/login";
                }
              }}
              disabled={signingOut}
              className="
          inline-flex items-center justify-center
          w-full sm:w-auto
          rounded-lg px-4 py-2
          text-sm font-semibold
          bg-neutral-100 text-black hover:bg-neutral-200
          transition-colors h-10
          disabled:opacity-70 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        "
            >
              {signingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
