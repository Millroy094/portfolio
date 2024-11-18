import { Grid2 as Grid, Typography } from "@mui/material";
import Lottie from "react-lottie";
import AboutMeLottie from "../lotties/about-me.json";
import GrowOnHover from "../hoc/GrowOnHover";
import { aboutMe } from "../configuration";

function AboutMe() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: AboutMeLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ marginBottom: "60px", zIndex: 10, position: "relative" }}
    >
      <Grid container spacing={2} justifyItems="center">
        <Grid
          container
          size={{ lg: 4, md: 0, sm: 0, xs: 0 }}
          sx={{ display: { md: "none", sm: "none", xs: "none", lg: "flex" } }}
        >
          <Lottie options={defaultOptions} width={400} height={400} />
        </Grid>
        <Grid
          container
          size={{ lg: 8, md: 12 }}
          alignContent="center"
          sx={{ padding: "0 20px" }}
        >
          <Grid container justifyContent="start" spacing={1}>
            <Typography
              variant="overline"
              fontWeight="bold"
              fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
              sx={{
                display: "inline-block",
              }}
            >
              About
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
              Me
            </Typography>
          </Grid>
          <Grid container>
            {aboutMe?.map((text) => (
              <GrowOnHover key={text}>
                <Typography variant="body1" fontSize="20px">
                  {text}
                </Typography>
              </GrowOnHover>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AboutMe;
