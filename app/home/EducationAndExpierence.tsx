"use client";

import { Grid } from "@mui/material";

import HistoryTimeline from "@/app/home/HistoryTimeline";
import LottiePlayer from "@/components/LottiePlayer";
import { useWebsiteData } from "@/context/WebsiteData";

function EducationAndExperience() {
  const { data } = useWebsiteData();
  const hasEducation = data.visibility.education && data.education && data.education.length > 0;
  const hasExperience =
    data.visibility.experiences && data.experiences && data.experiences.length > 0;
  const hasOneExperienceOrEducation = hasEducation || hasExperience;
  return (
    hasOneExperienceOrEducation && (
      <Grid container sx={{ zIndex: 10, position: "relative", marginBottom: "60px" }}>
        {hasExperience && (
          <HistoryTimeline
            title={"Experience"}
            timeline={
              data.experiences?.map((e) => ({
                title: e.organization,
                subTitle: e.title,
                year: e.year ?? 0,
              })) ?? []
            }
          />
        )}
        <Grid
          container
          size={{ lg: 3, sm: 0, xs: 0 }}
          sx={{ display: { lg: "flex", sm: "none", xs: "none" } }}
          justifyContent="center"
          alignItems="center"
        >
          {
            <LottiePlayer
              src="/lotties/work-and-education.json"
              className="w-45 h-45 md:w-55 md:h-55"
            />
          }
        </Grid>
        {hasEducation && (
          <HistoryTimeline
            title={"Education"}
            timeline={
              data.education?.map((e) => ({
                title: e.institute,
                subTitle: e.qualification,
                year: e.year ?? 0,
              })) ?? []
            }
          />
        )}
      </Grid>
    )
  );
}

export default EducationAndExperience;
