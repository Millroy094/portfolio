"use client";

import { Grid, Typography } from "@mui/material";
import Lottie from "react-lottie";

import SkillsLottie from "@/assets/lotties/skills.json";
import {
  getSkillById,
  SkillId,
  skillsRegistry,
} from "@/components/controls/SkillSelect/SkillRegistery";
import { useWebsiteData } from "@/context/WebsiteData";
import GrowAndShowLabelOnHover from "@/hoc/GrowAndShowLabelOnHover";

function Skills() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SkillsLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { data } = useWebsiteData();

  return (
    data.skills &&
    data.skills.length > 0 && (
      <Grid
        container
        justifyContent="center"
        sx={{ zIndex: 10, position: "relative", marginBottom: "60px" }}
      >
        <Grid
          container
          size={{ md: 3, sm: 0, xs: 0 }}
          sx={{ display: { md: "flex", sm: "none", xs: "none", lg: "flex" } }}
        >
          <Lottie options={defaultOptions} height={400} width={400} />
        </Grid>
        <Grid
          container
          justifyContent={{ md: "center", sm: "center", xs: "center" }}
          size={{ md: 9, sm: 12, xs: 12 }}
          sx={{ padding: "0 20px" }}
          spacing={1}
        >
          <Grid container spacing={1}>
            <Typography
              component="h2"
              variant="overline"
              fontWeight="bold"
              fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
              sx={{
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              Technology &
            </Typography>
            <Typography
              component="h2"
              variant="overline"
              fontWeight="bold"
              fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
              sx={{
                color: "#d32f2f",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              Skills
            </Typography>
          </Grid>
          <Grid container spacing={1}>
            {data.skills
              .filter((skill): skill is SkillId => skill in skillsRegistry)
              .map((skill) => {
                const skillObj = getSkillById(skill);

                return (
                  <Grid
                    container
                    key={skillObj.id}
                    aria-label={skillObj.label}
                    size={{ lg: 1, md: 2, sm: 3, xs: 4 }}
                  >
                    <GrowAndShowLabelOnHover label={skillObj.label} scale={1.5}>
                      {skillObj.render()}
                    </GrowAndShowLabelOnHover>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    )
  );
}

export default Skills;
