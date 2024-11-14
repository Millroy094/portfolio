import { TypeAnimation } from "react-type-animation";
import { Box, Avatar, Typography, IconButton, Button } from "@mui/material";
import { LinkedIn, GitHub, Download } from "@mui/icons-material";
import useWindowDimensions from "../hooks/useWindowDimensions";

import profileImage from "../assets/profile.jpeg";

function Introduction() {
  const { height, width } = useWindowDimensions();

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 10,
        height,
        width,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Avatar
          alt="Millroy Fernandes"
          src={profileImage}
          sx={{ width: 150, height: 150 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
        }}
      >
        <Typography variant="h2" component="span">
          Hi, I am
        </Typography>
        <Typography
          variant="h2"
          color="error"
          component="span"
          fontWeight="bold"
        >
          Millroy Fernandes
        </Typography>
      </Box>
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
    </Box>
  );
}

export default Introduction;
