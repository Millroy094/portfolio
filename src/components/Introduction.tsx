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
import useWindowDimensions from "../hooks/useWindowDimensions";

import profileImage from "../assets/profile.jpeg";
import { introduction } from "../configuration";

function Introduction() {
  const { height } = useWindowDimensions();

  return (
    <Grid
      sx={{
        position: "relative",
        zIndex: 10,
        height,
      }}
      alignContent="center"
      justifyItems="center"
    >
      <Grid justifyContent="center">
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
      <TypeAnimation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sequence={introduction.roles.reduce((squence: any[], role) => {
          squence.push(role);
          squence.push(1000);
          return squence;
        }, [])}
        wrapper="div"
        speed={50}
        style={{ fontSize: "2em", display: "block" }}
        repeat={Infinity}
      />
      <Typography variant="caption" component="span">
        {introduction.punchLine}
      </Typography>

      <Box sx={{ padding: "10px" }}>
        <IconButton
          aria-label="linkedin"
          style={{ color: "#0a66c2" }}
          onClick={() => window.open(introduction.linkedinUrl, "_blank")}
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          aria-label="github"
          style={{ color: "#ffffff" }}
          onClick={() => window.open(introduction.githubUrl, "_blank")}
        >
          <GitHub />
        </IconButton>
      </Box>
      <Button
        variant="contained"
        endIcon={<Download />}
        onClick={() => window.open(introduction.resumeUrl, "_blank")}
      >
        Download resume
      </Button>
    </Grid>
  );
}

export default Introduction;
