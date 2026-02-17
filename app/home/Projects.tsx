"use client";

import React from "react";

import { useWebsiteData } from "@/context/WebsiteData";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.588 2 12.253c0 4.51 2.865 8.328 6.839 9.678.5.096.683-.222.683-.49
           0-.242-.009-.883-.014-1.734-2.782.615-3.369-1.37-3.369-1.37-.454-1.174-1.11-1.487-1.11-1.487-.908-.637.07-.624.07-.624
           1.004.072 1.532 1.044 1.532 1.044.893 1.561 2.344 1.11 2.914.849.091-.662.35-1.11.636-1.366-2.221-.259-4.556-1.137-4.556-5.06
           0-1.118.385-2.033 1.018-2.75-.102-.26-.441-1.303.096-2.716 0 0 .834-.27 2.732 1.05A9.3 9.3 0 0 1 12 7.28c.846.004 1.697.116
           2.492.339 1.897-1.32 2.73-1.05 2.73-1.05.539 1.413.2 2.456.099 2.716.633.717 1.017 1.632 1.017 2.75
           0 3.933-2.338 4.798-4.566 5.053.359.315.679.935.679 1.884 0 1.36-.012 2.456-.012 2.79 0 .27.18.588.688.488C19.139 20.577 22 16.761 22 12.253
           22 6.588 17.522 2 12 2Z"
      />
    </svg>
  );
}

export default function Projects() {
  const { data } = useWebsiteData();

  const hasProjects =
    data.visibility.projects && Array.isArray(data.projects) && data.projects.length > 0;

  if (!hasProjects) return null;

  return (
    <section className="relative z-10 mb-15 px-5 sm:px-10">
      <div className="flex justify-center md:justify-center lg:justify-start gap-2">
        <h2
          className="font-bold uppercase tracking-wide text-red-700
                     text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] mb-5"
        >
          Projects
        </h2>
      </div>

      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
        "
      >
        {data.projects?.map((project) => (
          <article
            key={project.name}
            className="
              group flex flex-col justify-between min-h-62.5
              rounded-xl border border-zinc-800/60 bg-zinc-900/70
              shadow-md hover:shadow-lg transition-shadow
              backdrop-blur supports-backdrop-filter:bg-zinc-900/60
              p-4
            "
          >
            <header className="mb-2">
              <h3 className="text-lg font-semibold text-zinc-100">{project.name}</h3>
            </header>

            <div className="text-zinc-300 text-sm flex-1">{project.description}</div>

            <footer className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => window.open(project.url, "_blank", "noopener,noreferrer")}
                className="
                  inline-flex items-center gap-2
                  rounded-md bg-red-700 text-white
                  px-4 py-2 text-sm font-medium
                  hover:bg-red-600 active:bg-red-700/90
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70
                  transition-colors
                "
                aria-label={`View ${project.name} repository on GitHub`}
              >
                <span>View Repo</span>
                <GitHubIcon className="h-4 w-4" />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
