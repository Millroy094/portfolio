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

  return (
    <section className="relative z-10 mb-15 flex flex-col px-6 sm:px-0">
      <div className="flex flex-col xl:flex-row items-center xl:items-stretch gap-10">
        {hasExperience && (
          <div className="w-full xl:w-1/2">
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
          <div className="hidden xl:flex justify-center items-stretch w-24">
            <VerticalEnergyGraphic style={{ contain: "layout style paint" }} />
          </div>
        )}

        {hasEducation && (
          <div className="w-full xl:w-1/2">
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
