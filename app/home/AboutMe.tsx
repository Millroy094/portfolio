"use client";

import LottiePlayer from "@/components/LottiePlayer";
import { useWebsiteData } from "@/context/WebsiteData";
import GrowOnHover from "@/hoc/GrowOnHover";
import { htmlToText, splitHtmlIntoParagraphs } from "@/utils/paragraph";

function AboutMe() {
  const { data } = useWebsiteData();

  const aboutMe =
    data.visibility.aboutMe && data.aboutMe
      ? splitHtmlIntoParagraphs(data.aboutMe)?.map(htmlToText)
      : [];

  if (!data.visibility.aboutMe || aboutMe.length === 0) return null;

  return (
    <section className="relative z-10 mb-15 flex flex-col">
      <div className="flex w-full flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
        <div className="hidden lg:flex justify-center items-end w-1/3">
          <LottiePlayer src="/lotties/about-me.json" className="w-full h-auto max-w-90" />
        </div>

        <div className="w-full lg:w-2/3 px-5 flex flex-col items-center lg:items-start">
          <div className="flex justify-center gap-2 mb-4">
            <h2
              className="inline-block font-bold uppercase tracking-wide
                         text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px]"
            >
              About
            </h2>
            <h2
              className="inline-block font-bold uppercase tracking-wide
                         text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] text-red-700"
            >
              Me
            </h2>
          </div>

          <div className="w-full lg:pr-2 space-y-4">
            {aboutMe.map((text) => (
              <GrowOnHover key={text}>
                <p className="text-[20px] leading-relaxed">{text}</p>
              </GrowOnHover>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
