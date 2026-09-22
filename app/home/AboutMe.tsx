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
    <section className="relative z-10 mb-20 md:mb-28 flex flex-col px-6 lg:px-10">
      <div className="flex w-full max-w-384 mx-auto flex-col gap-y-6 md:gap-y-8 lg:grid lg:grid-cols-[1fr_2fr] lg:grid-rows-[auto_1fr] lg:gap-x-10">
        {isLargeScreen && (
          <div className="hidden lg:flex justify-center lg:col-start-1 lg:row-start-2">
            <AboutMeGraphic className="w-full" style={{ contain: "layout style paint" }} />
          </div>
        )}

        <div className="flex justify-center gap-2 lg:justify-start lg:col-start-2 lg:row-start-1">
          <h2
            className="inline-block font-bold uppercase tracking-wide
                         text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:text-[20px] text-white/90"
          >
            About
          </h2>
          <h2
            className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 font-bold uppercase tracking-wide
                         text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:text-[20px] text-red-500"
          >
            Me
          </h2>
        </div>

        <div className="w-full flex flex-col items-center gap-4 lg:items-start lg:col-start-2 lg:row-start-2 lg:pr-2">
          {aboutMe.map((text) => (
            <GrowOnHover key={text}>
              <p className="text-center lg:text-left text-[20px] leading-relaxed text-white/90">
                {text}
              </p>
            </GrowOnHover>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
