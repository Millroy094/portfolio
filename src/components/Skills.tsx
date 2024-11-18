import { Grid2 as Grid, Typography } from "@mui/material";
import Lottie from "react-lottie";
import SkillsLottie from "../lotties/skills.json";
import { skills } from "../configuration";
import GrowAndShowLabelOnHover from "../hoc/GrowAndShowLabelOnHover";

function Skills() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SkillsLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
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
        size={{ md: 9, sm: 12, xs: 12 }}
        sx={{ padding: "0 20px" }}
        spacing={1}
      >
        <Grid container spacing={1}>
          <Typography
            variant="overline"
            fontWeight="bold"
            fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
            sx={{
              display: "inline-block",
            }}
          >
            Technology &
          </Typography>
          <Typography
            variant="overline"
            fontWeight="bold"
            fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
            sx={{
              color: "#d32f2f",
              display: "inline-block",
            }}
          >
            Skills
          </Typography>
        </Grid>
        <Grid container spacing={1}>
          {skills?.map((skill: JSX.Element) => (
            <Grid
              container
              key={skill.key}
              aria-label={skill.key!}
              size={{ lg: 1, md: 2, sm: 3, xs: 4 }}
            >
              <GrowAndShowLabelOnHover label={skill.key!} scale={1.5}>
                {skill}
              </GrowAndShowLabelOnHover>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Skills;
