"use client";

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import {
  Grid,
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { LinkedIn, GitHub, Download } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import PortfolioAppBar from "@/app/home/AppBar";
import { SiStackoverflow } from "@icons-pack/react-simple-icons";
import { JSX } from "react";
import { useWebsiteData } from "@/context/WebsiteData";

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
        <Grid container justifyContent="center">
          <Avatar
            alt={data.fullName}
            src={data.avatarUrl}
            sx={{ width: 150, height: 150, marginBottom: 2 }}
          />
        </Grid>
        <Grid container justifyContent="center" spacing={1}>
          <Typography
            variant="h2"
            component="span"
            fontSize={{ xs: 20, sm: 40, md: 60, lg: 60 }}
          >
            Hi, I am
          </Typography>
          <Typography
            variant="h2"
            color="error"
            component="span"
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
          {data.badgeUrls.length > 0 && (
            <Grid container justifyContent="center" p={4}>
              {data.badgeUrls.map((badgeUrl, i) => (
                <Image
                  key={badgeUrl}
                  width={200}
                  height={200}
                  src={badgeUrl}
                  alt={`Certificate ${i}`}
                />
              ))}
            </Grid>
          )}
          <Box
            sx={{ padding: "10px", display: "flex", justifyContent: "center" }}
          >
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
