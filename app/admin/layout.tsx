"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminThemeProvider } from "@/context/AdminTheme";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const { user, route } = useAuthenticator((context) => [context.user, context.route]);

  const username = user?.signInDetails?.loginId ?? user?.username ?? "Unknown user";

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("adminTheme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

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

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-neutral-50 text-neutral-950"}`}
    >
      <header
        className={`w-full ${isDark ? "bg-gradient-to-b from-neutral-900/60 to-black border-neutral-800/40" : "bg-white border-neutral-200"} border-b shadow-lg`}
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
                  {username}
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
                } finally {
                  if (route !== "signIn") window.location.href = "/login";
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

      {children}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminThemeProvider>
  );
}
