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
          alt="Millroy Fernandes"
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
          Millroy Fernandes
        </Typography>
      </Grid>
      <TypeAnimation
        sequence={[
          "Software Engineer",
          1000,
          "DevOps Engineer",
          1000,
          "Automation QA Engineer",
          1000,
        ]}
        wrapper="div"
        speed={50}
        style={{ fontSize: "2em", display: "block" }}
        repeat={Infinity}
      />
      <Typography variant="caption" component="span">
        Hungry for knowledge and inspired by change
      </Typography>

      <Box sx={{ padding: "10px" }}>
        <IconButton
          aria-label="linkedin"
          style={{ color: "#0a66c2" }}
          onClick={() =>
            window.open(
              "https://www.linkedin.com/in/millroy-fernandes-5a2688102/",
              "_blank"
            )
          }
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          aria-label="github"
          style={{ color: "#ffffff" }}
          onClick={() =>
            window.open("https://www.github.com/millroy094/", "_blank")
          }
        >
          <GitHub />
        </IconButton>
      </Box>
      <Button
        variant="contained"
        endIcon={<Download />}
        onClick={() =>
          window.open(
            "https://drive.google.com/file/d/1QMmx_J6Lvh2yzW9fUQxaJROLdopT26a2/view?usp=drive_link",
            "_blank"
          )
        }
      >
        Download resume
      </Button>
    </Grid>
  );
}

export default Introduction;
