"use client";

import { Grid, Typography } from "@mui/material";
import Lottie from "react-lottie";

import AboutMeLottie from "@/assets/lotties/about-me.json";
import { useWebsiteData } from "@/context/WebsiteData";
import GrowOnHover from "@/hoc/GrowOnHover";
import { htmlToText, splitHtmlIntoParagraphs } from "@/utils/paragraph";

function AboutMe() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: AboutMeLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { data } = useWebsiteData();

  const aboutMe = splitHtmlIntoParagraphs(data.aboutMe)?.map(htmlToText);

  return (
    aboutMe?.length > 0 && (
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
            size={{ lg: 8, md: 12, sm: 12, xs: 12 }}
            justifyContent={{ md: "center", sm: "center", xs: "center" }}
            alignContent="center"
            sx={{ padding: "0 20px" }}
          >
            <Grid container justifyContent="center" spacing={1}>
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
            <Grid container sx={{ pr: { lg: 2 }, minWidth: 0 }}>
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
    )
  );
}

export default AboutMe;
