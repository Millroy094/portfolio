"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useMemo, useRef, useState, useCallback } from "react";

import HideOnScroll from "@/components/HideOnScroll";
import { useWebsiteData } from "@/context/WebsiteData";

function normalizeId(label: string) {
  return label.toLowerCase().replace(/\s/g, "");
}

function EditIcon({ className = "" }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536M4 20h4l10.733-10.732a2.5 2.5 0 00-3.536-3.536L4 16.464V20z"
      />
    </svg>
  );
}

export default function PortfolioAppBar() {
  const { user } = useAuthenticator();
  const { data } = useWebsiteData();

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pages = useMemo(() => {
    const list: string[] = [];
    if (data.visibility.aboutMe && data.aboutMe) list.push("About Me");
    if (data.visibility.skills && data.skills?.length) list.push("Skills");
    if (
      (data.visibility.education && data.education?.length > 0) ||
      (data.visibility.experiences && data.experiences?.length > 0)
    )
      list.push("Education And Experience");
    if (data.visibility.projects && data.projects?.length) list.push("Projects");
    return list;
  }, [data]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerH = headerRef.current?.offsetHeight ?? 0;
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - headerH - 8;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  return (
    <HideOnScroll threshold={16}>
      <header
        ref={headerRef}
        className="
          sticky top-0 w-full z-1100
          bg-transparent
        "
      >
        <div className="mx-auto max-w-384 px-3 md:px-4">
          <div className="h-14 md:h-16 flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="
                md:hidden
                text-white/90 hover:text-white
                focus:outline-none
              "
              aria-label="Open navigation"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" d="M4 6h16" />
                <path strokeLinecap="round" d="M4 12h16" />
                <path strokeLinecap="round" d="M4 18h16" />
              </svg>
            </button>

            <nav className="hidden md:flex gap-6 items-center">
              {pages.map((page) => {
                const id = normalizeId(page);
                return (
                  <button
                    key={page}
                    onClick={() => scrollToSection(id)}
                    className="
                      text-white
                      focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2
                    "
                  >
                    <span
                      className="
                        relative inline-block
                        font-bold uppercase tracking-wide text-sm
                        pb-1
                        md:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)]
                        after:absolute after:left-0 after:bottom-0
                        after:h-0.5 after:w-0 after:bg-red-500
                        after:transition-all after:duration-300
                        hover:after:w-full
                      "
                    >
                      {page}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="grow" />

            {user && (
              <button
                onClick={() => (window.location.href = "/admin")}
                className="
                  hidden md:flex items-center gap-2
                  bg-red-600 hover:bg-red-700 active:bg-red-800
                  text-white uppercase text-xs
                  px-4 py-2 rounded
                  transition-colors
                "
              >
                <EditIcon />
                <span className="text-sm font-bold">Edit Website</span>
              </button>
            )}
          </div>
        </div>

        <div
          className={`
            md:hidden w-full
            ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            overflow-hidden transition-all duration-200 ease-out
            bg-[rgba(18,18,24,0.92)] backdrop-blur-md border-t border-white/10
          `}
        >
          {pages.map((page) => {
            const id = normalizeId(page);
            return (
              <button
                key={page}
                onClick={() => {
                  setMobileOpen(false);
                  setTimeout(() => scrollToSection(id), 0);
                }}
                className="
                  w-full py-3 text-center
                  text-white
                  hover:bg-white/10 transition-colors duration-200
                  focus:outline-none
                "
              >
                <span className="text-xs font-bold uppercase tracking-wide">{page}</span>
              </button>
            );
          })}

          {user && (
            <button
              onClick={() => {
                setMobileOpen(false);
                window.location.href = "/admin";
              }}
              className="
                w-full py-3 text-center
                text-red-400 font-bold uppercase tracking-wide
                hover:bg-white/10 transition-colors duration-200
                flex items-center justify-center gap-2 text-xs
              "
            >
              <span className="text-xs font-bold">Edit Website</span>
            </button>
          )}
        </div>
      </header>
    </HideOnScroll>
  );
}
