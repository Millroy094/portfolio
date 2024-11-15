import { Grid2 as Grid, Typography } from "@mui/material";
import Lottie from "react-lottie";
import SkillsLottie from "../lotties/skills.json";
import GrowOnHover from "../hoc/GrowOnHover";
import { skills } from "../configuration";

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
      <Grid container size={{ md: 3, sm: 0, xs: 0 }}>
        <Lottie options={defaultOptions} height={400} width={400} />
      </Grid>
      <Grid container size={{ md: 9, sm: 12, xs: 12 }} sx={{ padding: "40px" }}>
        <Grid container spacing={2}>
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
              size={{ lg: 1, md: 2, sm: 2, xs: 2 }}
            >
              <GrowOnHover scale={1.5}>{skill}</GrowOnHover>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Skills;
