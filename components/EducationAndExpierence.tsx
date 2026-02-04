'use client'

import { Grid } from "@mui/material";
import Lottie from "react-lottie";
import HistoryTimeline from "@/components/HistoryTimeline";
import WorkAndEducationLottie from "@/assets/lotties/work-and-education.json";
import { educationTimeline, workTimeline } from "@/configuration";

function EducationAndExperience() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: WorkAndEducationLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Grid
      container
      sx={{ zIndex: 10, position: "relative", marginBottom: "60px" }}
    >
      <HistoryTimeline title={"Experience"} timeline={workTimeline} />
      <Grid
        container
        size={{ lg: 3, sm: 0, xs: 0 }}
        sx={{ display: { lg: "flex", sm: "none", xs: "none" } }}
        justifyContent="center"
        alignItems="center"
      >
        <Lottie options={defaultOptions} height={300} width={300} />
      </Grid>
      <HistoryTimeline title={"Education"} timeline={educationTimeline} />
    </Grid>
  );
}

export default EducationAndExperience;
