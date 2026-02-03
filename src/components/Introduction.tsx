import { TypeAnimation } from "react-type-animation";
import {
  Grid2 as Grid,
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { LinkedIn, GitHub, Download } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import useWindowDimensions from "../hooks/useWindowDimensions";

import profileImage from "../assets/profile.jpeg";
import awsCert from '../assets/aws-certified-solutions-architect-associate.png'
import { introduction } from "../configuration";
import PortfolioAppBar from "./AppBar";
import { SiStackoverflow } from "@icons-pack/react-simple-icons";

function Introduction() {
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
            alt={introduction.name}
            src={profileImage}
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
            {introduction.name}
          </Typography>
        </Grid>
        <Grid container justifyContent="center">
          <TypeAnimation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sequence={introduction.roles.reduce((squence: any[], role) => {
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
        <Grid container alignItems="center" direction="column">
          <Typography variant="caption" component="span">
            {introduction.punchLine}
          </Typography>
          <Grid container justifyContent="center" p={4}>
            <img width={200} height={200} src={awsCert}  alt='AWS Certificate' />
          </Grid>
          <Box
            sx={{ padding: "10px", display: "flex", justifyContent: "center" }}
          >
            <IconButton
              aria-label="linkedin"
              onClick={() => window.open(introduction.linkedinUrl, "_blank")}
              sx={{
                "&.MuiIconButton-root:focus": { outline: "none" },
                color: "#0a66c2",
              }}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              aria-label="github"
              onClick={() => window.open(introduction.githubUrl, "_blank")}
              sx={{
                "&.MuiIconButton-root:focus": { outline: "none" },
                color: "#ffffff",
              }}
            >
              <GitHub />
            </IconButton>
            <IconButton
              aria-label="stack-overflow"
              onClick={() =>
                window.open(introduction.stackOverflowUrl, "_blank")
              }
              sx={{
                "&.MuiIconButton-root:focus": { outline: "none" },
                color: "#ffffff",
              }}
            >
              <SiStackoverflow key="StackOverflow" color="#F58025" />
            </IconButton>
          </Box>

          <Button
            sx={{ alignSelf: "center" }}
            variant="contained"
            endIcon={<Download />}
            onClick={() => window.open(introduction.resumeUrl, "_blank")}
          >
            Download resume
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Introduction;
