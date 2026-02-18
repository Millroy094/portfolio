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
      <header className="w-full bg-[#0b0b0b] border-b border-red-800 shadow-lg">
        <div className="mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4">
          <div className="text-center sm:text-left">
            <div className="inline-block px-4 py-2 border border-red-800 rounded-md bg-black/40">
              <span className="text-sm tracking-wide text-white">
                Welcome <strong>{username}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2">
            <Link
              className="
          bg-red-700 hover:bg-red-800 active:bg-red-900
          text-white px-4 py-3 rounded-md uppercase text-xs tracking-wide font-semibold
          text-center w-full sm:w-auto transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black
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
          rounded-md px-4 py-2
          uppercase tracking-wide
          bg-white text-black hover:bg-white/90
          transition-colors
          disabled:opacity-70 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        "
            >
              <span className="text-xs font-semibold">
                {signingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
