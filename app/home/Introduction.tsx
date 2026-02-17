"use client";

import { SiStackoverflow } from "@icons-pack/react-simple-icons";
import { JSX } from "react";
import { TypeAnimation } from "react-type-animation";

import PortfolioAppBar from "@/app/home/AppBar";
import AvatarWithSkeleton from "@/app/home/AvatarWithSkeleton";
import BadgeSlider from "@/app/home/BadgeSlider";
import { useWebsiteData } from "@/context/WebsiteData";
import useWindowDimensions from "@/hooks/useWindowDimensions";

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#0a66c2" {...props}>
      <path
        d="M20.452 20.452h-3.555v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136
      1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.049c.476-.9
      1.637-1.848 3.37-1.848 3.601 0 4.267 2.37 4.267 5.455v6.284zM5.337
      7.433a2.062 2.062 0 110-4.125 2.062 2.062 0 010 4.125zM7.115
      20.452H3.556V9h3.559v11.452z"
      />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.59 2 12.26c0 4.52
      2.87 8.34 6.85 9.69.5.09.68-.23.68-.49 0-.24-.01-.88-.01-1.74-2.79.62-3.38-1.37-3.38-1.37
      -.46-1.18-1.12-1.49-1.12-1.49-.91-.64.07-.62.07-.62
      1.01.07 1.53 1.05 1.53 1.05.89 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.36
      -2.23-.26-4.56-1.14-4.56-5.07 0-1.12.38-2.03 1.02-2.75-.10-.26-.44-1.30.10-2.72
      0 0 .84-.27 2.74 1.05a9.44 9.44 0 0 1 4.99 0c1.90-1.32 2.74-1.05 2.74-1.05.54 1.42.20 2.46.10 2.72.64.72
      1.02 1.63 1.02 2.75 0 3.94-2.34 4.81-4.57 5.07.36.31.68.93.68 1.88
      0 1.36-.01 2.45-.01 2.79 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.26C22 6.59 17.52 2 12 2z"
      />
    </svg>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7z" />
    </svg>
  );
}

export default function Introduction(): JSX.Element {
  const { data } = useWebsiteData();
  const { height } = useWindowDimensions();

  return (
    <>
      <PortfolioAppBar />

      <div
        className="
    relative z-10
    overflow-auto
    flex flex-col items-center justify-center
    px-4 sm:px-6
  "
        style={{ height }}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <AvatarWithSkeleton data={{ avatarUrl: data.avatarUrl, fullName: data.fullName }} />
        </div>

        {/* Name */}
        <div className="flex justify-center flex-wrap gap-2 text-center mb-1">
          <span className="text-[20px] sm:text-[40px] md:text-[60px] font-normal text-white/90">
            Hi, I am
          </span>
          <h1 className="text-[20px] sm:text-[40px] md:text-[60px] font-bold text-red-600">
            {data.fullName || "Unknown"}
          </h1>
        </div>

        {!data.fullName && <div className="text-sm opacity-70 mb-2">Please finish my setup</div>}

        {data.visibility.roles && data.roles.length > 0 && (
          <div className="flex justify-center mb-2 text-center">
            <TypeAnimation
              sequence={data.roles.flatMap((r) => [r, 1000])}
              wrapper="div"
              speed={50}
              className="
                text-[18px] sm:text-[28px] md:text-[40px]
                leading-none
                tracking-wide
                text-white/90
                m-0 p-0
              "
              repeat={Infinity}
            />
          </div>
        )}

        <div className="flex flex-col items-center">
          {data.punchLine && (
            <span className="text-sm text-white/90 opacity-80 mb-2">{data.punchLine}</span>
          )}

          {data.visibility.badges && data.badges.length > 0 && <BadgeSlider badges={data.badges} />}

          <div className="flex gap-4 py-4 items-center justify-center">
            {data.linkedin && (
              <button
                onClick={() => window.open(data.linkedin, "_blank")}
                aria-label="LinkedIn"
                className="text-[#0A66C2] hover:scale-110 transition-transform"
              >
                <LinkedInIcon className="w-7 h-7" />
              </button>
            )}

            {data.github && (
              <button
                onClick={() => window.open(data.github, "_blank")}
                aria-label="GitHub"
                className="text-white hover:scale-110 transition-transform"
              >
                <GitHubIcon className="w-7 h-7" />
              </button>
            )}

            {data.stackOverflow && (
              <button
                onClick={() => window.open(data.stackOverflow, "_blank")}
                aria-label="Stack Overflow"
                className="hover:scale-110 transition-transform"
              >
                <SiStackoverflow className="w-7 h-7 text-[#F58025]" />
              </button>
            )}
          </div>

          {data.resume && (
            <button
              onClick={() => window.open(data.resume, "_blank")}
              className="
          bg-red-600 hover:bg-red-700
          text-white font-medium
          px-4 py-2 rounded-md
          flex items-center gap-2
          transition-colors
        "
            >
              Download resume
              <DownloadIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
