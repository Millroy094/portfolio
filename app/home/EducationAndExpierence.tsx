"use client";

import HistoryTimeline from "@/app/home/HistoryTimeline";
import LottiePlayer from "@/components/LottiePlayer";
import { useWebsiteData } from "@/context/WebsiteData";

function EducationAndExperience() {
  const { data } = useWebsiteData();

  const hasEducation = data.visibility.education && data.education && data.education.length > 0;

  const hasExperience =
    data.visibility.experiences && data.experiences && data.experiences.length > 0;

  const hasOneExperienceOrEducation = hasEducation || hasExperience;

  if (!hasOneExperienceOrEducation) return null;

  return (
    <section className="relative z-10 mb-15 flex flex-col px-6 sm:px-0">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
        {hasExperience && (
          <div className="w-full lg:w-1/2">
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

        <div className="hidden xl:flex justify-center items-center self-center w-75 max-w-65">
          <LottiePlayer src="/lotties/work-and-education.json" className="w-full h-auto max-w-90" />
        </div>

        {hasEducation && (
          <div className="w-full lg:w-1/2">
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
