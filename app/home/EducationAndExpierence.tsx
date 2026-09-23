"use client";

import { useEffect, useState } from "react";

import HistoryTimeline from "@/app/home/HistoryTimeline";
import TechCircuitGraphic from "@/components/TechCircuitGraphic";
import { useWebsiteData } from "@/context/WebsiteData";

function EducationAndExperience() {
  const { data } = useWebsiteData();
  const [showCircuit, setShowCircuit] = useState(false);

  useEffect(() => {
    // Show the circuit background whenever Experience/Education are laid out
    // side-by-side on a reasonably large viewport (md breakpoint up). Hidden on
    // small/landscape-mobile screens where it reads as cluttered.
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setShowCircuit(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const hasEducation = data.visibility.education && data.education && data.education.length > 0;

  const hasExperience =
    data.visibility.experiences && data.experiences && data.experiences.length > 0;

  const hasOneExperienceOrEducation = hasEducation || hasExperience;

  if (!hasOneExperienceOrEducation) return null;

  return (
    <section className="relative z-10 mb-20 md:mb-28 flex flex-col px-6 sm:px-0 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:px-2">
      <div className="relative flex flex-col md:flex-row items-center md:items-start [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:flex-row [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:items-start [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:gap-4 gap-10">
        {showCircuit && (
          <div
            className="hidden md:block absolute inset-0 z-0 opacity-15 pointer-events-none"
            aria-hidden="true"
          >
            <TechCircuitGraphic style={{ contain: "layout style paint" }} />
          </div>
        )}

        {hasExperience && (
          <div className="relative z-10 w-full md:flex-1 md:min-w-0 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:flex-1 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:min-w-0">
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

        {hasEducation && (
          <div className="relative z-10 w-full md:flex-1 md:min-w-0 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:flex-1 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:min-w-0">
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
