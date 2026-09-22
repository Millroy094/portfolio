"use client";

import { useEffect, useState } from "react";

import AboutMeGraphic from "@/components/AboutMeGraphic";
import { useWebsiteData } from "@/context/WebsiteData";
import GrowOnHover from "@/hoc/GrowOnHover";
import { htmlToText, splitHtmlIntoParagraphs } from "@/utils/paragraph";

function AboutMe() {
  const { data } = useWebsiteData();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const aboutMe =
    data.visibility.aboutMe && data.aboutMe
      ? splitHtmlIntoParagraphs(data.aboutMe)?.map(htmlToText)
      : [];

  if (!data.visibility.aboutMe || aboutMe.length === 0) return null;

  return (
    <section className="relative z-10 mb-15 flex flex-col px-6 lg:px-10">
      <div className="flex w-full flex-col lg:flex-row items-start lg:items-stretch gap-6 lg:gap-10">
        {isLargeScreen && (
          <div className="hidden lg:flex justify-center items-stretch w-1/3">
            <AboutMeGraphic className="w-full" style={{ contain: "layout style paint" }} />
          </div>
        )}

        <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start">
          <div className="flex justify-center gap-2 mb-4">
            <h2
              className="inline-block font-bold uppercase tracking-wide
                         text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] text-white/90"
            >
              About
            </h2>
            <h2
              className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 font-bold uppercase tracking-wide
                         text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] text-red-500"
            >
              Me
            </h2>
          </div>

          <div className="w-full lg:pr-2 space-y-4">
            {aboutMe.map((text) => (
              <GrowOnHover key={text}>
                <p className="text-center lg:text-left text-[20px] leading-relaxed text-white/90">
                  {text}
                </p>
              </GrowOnHover>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
