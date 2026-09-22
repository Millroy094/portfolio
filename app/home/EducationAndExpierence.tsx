"use client";

import { useEffect, useState } from "react";

import HistoryTimeline from "@/app/home/HistoryTimeline";
import VerticalEnergyGraphic from "@/components/VerticalEnergyGraphic";
import { useWebsiteData } from "@/context/WebsiteData";

function EducationAndExperience() {
  const { data } = useWebsiteData();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 1280);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const hasEducation = data.visibility.education && data.education && data.education.length > 0;

  const hasExperience =
    data.visibility.experiences && data.experiences && data.experiences.length > 0;

  const hasOneExperienceOrEducation = hasEducation || hasExperience;

  if (!hasOneExperienceOrEducation) return null;

  const experienceRowCount = data.experiences?.length ?? 0;
  const educationRowCount = new Set(data.education?.map((e) => e.institute)).size;
  const longerRowCount = Math.max(experienceRowCount, educationRowCount);
  const fadeStartPercent =
    longerRowCount > 1 ? Math.min(40, Math.max(8, (1 / (longerRowCount - 1)) * 100)) : 10;
  const fadeEndPercent =
    longerRowCount > 1
      ? Math.min(92, Math.max(60, ((longerRowCount - 2) / (longerRowCount - 1)) * 100))
      : 90;

  return (
    <section className="relative z-10 mb-20 md:mb-28 flex flex-col px-6 sm:px-0 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:px-2">
      <div className="flex flex-col md:flex-row items-center md:items-start [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:flex-row [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:items-start [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:gap-4 gap-10">
        {hasExperience && (
          <div className="w-full md:flex-1 md:min-w-0 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:flex-1 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:min-w-0">
            <HistoryTimeline
              title="Experience"
              timeline={
                data.experiences?.map((e) => ({
                  title: e.organization,
                  subTitle: e.title,
                  year: e.year ?? 0,
                  type: "experience",
                })) ?? []
              }
            />
          </div>
        )}

        {isLargeScreen && (
          <div className="hidden xl:flex justify-center items-stretch w-32 pt-16 shrink-0">
            <VerticalEnergyGraphic
              style={{
                contain: "layout style paint",
                ["--connector-fade-start" as string]: `${fadeStartPercent}%`,
                ["--connector-fade-end" as string]: `${fadeEndPercent}%`,
              }}
            />
          </div>
        )}

        {hasEducation && (
          <div className="w-full md:flex-1 md:min-w-0 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:flex-1 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:min-w-0">
            <HistoryTimeline
              title="Education"
              timeline={
                data.education?.map((e) => ({
                  title: e.institute,
                  subTitle: e.qualification,
                  year: e.year ?? 0,
                  type: "education",
                })) ?? []
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default EducationAndExperience;
