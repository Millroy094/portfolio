import { TypeAnimation } from "react-type-animation";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import { LinkedIn, GitHub } from "@mui/icons-material";

import profileImage from "../assets/profile.jpeg";

function Introduction() {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          alt="Millroy Fernandes"
          src={profileImage}
          sx={{ width: 150, height: 150 }}
        />
      </Box>
      <Typography variant="h2" component="span">
        Hi, I am{" "}
      </Typography>
      <Typography variant="h2" color="error" component="span" fontWeight="bold">
        Millroy Fernandes
      </Typography>
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
          color="primary"
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
          color="primary"
          onClick={() =>
            window.open("https://www.github.com/millroy094/", "_blank")
          }
        >
          <GitHub />
        </IconButton>
      </Box>
    </>
  );
}

export default Introduction;
