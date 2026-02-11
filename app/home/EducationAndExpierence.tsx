"use client";

import { Grid } from "@mui/material";
import Lottie from "react-lottie";
import HistoryTimeline from "@/app/home/HistoryTimeline";
import WorkAndEducationLottie from "@/assets/lotties/work-and-education.json";
import { useWebsiteData } from "@/context/WebsiteData";

function EducationAndExperience() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: WorkAndEducationLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { data } = useWebsiteData();
  const hasEducation = data.education && data.education.length > 0;
  const hasExperience = data.experiences && data.experiences.length > 0;
  const hasOneExperienceOrEducation = hasEducation || hasExperience;
  return (
    hasOneExperienceOrEducation && (
      <Grid
        container
        sx={{ zIndex: 10, position: "relative", marginBottom: "60px" }}
      >
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
          <Lottie options={defaultOptions} height={300} width={300} />
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
