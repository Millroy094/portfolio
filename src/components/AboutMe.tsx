import { Box, Typography } from "@mui/material";
import { Zoom } from "react-awesome-reveal";

function AboutMe() {
  return (
    <Zoom>
      <Box>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            borderBottom: "5px solid #d32f2f",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          About Me
        </Typography>
      </Box>
    </Zoom>
  );
}

export default AboutMe;
