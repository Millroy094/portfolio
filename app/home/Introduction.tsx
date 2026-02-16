"use client";

import { SiStackoverflow } from "@icons-pack/react-simple-icons";
import { LinkedIn, GitHub, Download } from "@mui/icons-material";
import { Grid, Box, Typography, IconButton, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { JSX } from "react";
import { TypeAnimation } from "react-type-animation";

import PortfolioAppBar from "@/app/home/AppBar";
import AvatarWithSkeleton from "@/app/home/AvatarWithSkeleton";
import BadgeSlider from "@/app/home/BadgeSlider";
import { useWebsiteData } from "@/context/WebsiteData";
import useWindowDimensions from "@/hooks/useWindowDimensions";

function Introduction(): JSX.Element {
  const { data } = useWebsiteData();

  const { height } = useWindowDimensions();
  const isBelowMidSize = useMediaQuery("(max-width:959px)");
  return (
    <>
      <PortfolioAppBar />
      <Grid
        sx={{
          position: "relative",
          zIndex: 10,
          height,
        }}
        overflow="auto"
        alignContent="center"
        justifyItems="center"
      >
        <Grid container justifyContent="center" padding={1}>
          <AvatarWithSkeleton data={{ avatarUrl: data.avatarUrl, fullName: data.fullName }} />
        </Grid>
        <Grid container justifyContent="center" spacing={1}>
          <Typography variant="h2" component="span" fontSize={{ xs: 20, sm: 40, md: 60, lg: 60 }}>
            Hi, I am
          </Typography>
          <Typography
            color="error"
            component="h1"
            fontWeight="bold"
            fontSize={{ xs: 20, sm: 40, md: 60, lg: 60 }}
          >
            {data.fullName || "Unknown"}
          </Typography>
        </Grid>
        {!data.fullName && (
          <Grid container alignItems="center" direction="column">
            <Typography variant="caption" component="span">
              Please finish my setup
            </Typography>
          </Grid>
        )}
        {data.roles.length > 0 && (
          <Grid container justifyContent="center">
            <TypeAnimation
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sequence={data.roles.reduce((squence: any[], role) => {
                squence.push(role);
                squence.push(1000);
                return squence;
              }, [])}
              wrapper="div"
              speed={50}
              style={{
                fontSize: isBelowMidSize ? "1em" : "2em",
                display: "block",
              }}
              repeat={Infinity}
            />
          </Grid>
        )}
        <Grid container alignItems="center" direction="column">
          {data.punchLine && (
            <Typography variant="caption" component="span">
              {data.punchLine}
            </Typography>
          )}
          {data.badges.length > 0 && (
            <BadgeSlider badges={data.badges} loop autoplay autoplayDelayMs={3000} />
          )}
          <Box sx={{ padding: "10px", display: "flex", justifyContent: "center" }}>
            {data.linkedin && (
              <IconButton
                aria-label="linkedin"
                onClick={() => window.open(data.linkedin, "_blank")}
                sx={{
                  "&.MuiIconButton-root:focus": { outline: "none" },
                  color: "#0a66c2",
                }}
              >
                <LinkedIn />
              </IconButton>
            )}
            {data.github && (
              <IconButton
                aria-label="github"
                onClick={() => window.open(data.github, "_blank")}
                sx={{
                  "&.MuiIconButton-root:focus": { outline: "none" },
                  color: "#ffffff",
                }}
              >
                <GitHub />
              </IconButton>
            )}
            {data.stackOverflow && (
              <IconButton
                aria-label="stack-overflow"
                onClick={() => window.open(data.stackOverflow, "_blank")}
                sx={{
                  "&.MuiIconButton-root:focus": { outline: "none" },
                  color: "#ffffff",
                }}
              >
                <SiStackoverflow key="StackOverflow" color="#F58025" />
              </IconButton>
            )}
          </Box>

          {data.resume && (
            <Button
              sx={{ alignSelf: "center" }}
              variant="contained"
              endIcon={<Download />}
              onClick={() => window.open(data.resume, "_blank")}
            >
              Download resume
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default Introduction;
