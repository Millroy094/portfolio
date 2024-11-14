import { Box, Typography } from "@mui/material";
import { Zoom } from "react-awesome-reveal";
import StackIcon from "tech-stack-icons";

function AboutMe() {
  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Zoom cascade>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Typography
            variant="overline"
            fontWeight="bold"
            fontSize={35}
            sx={{
              display: "inline-block",
            }}
          >
            About
          </Typography>
          <Typography
            variant="overline"
            fontWeight="bold"
            fontSize={35}
            sx={{
              color: "#d32f2f",
              display: "inline-block",
            }}
          >
            Me
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              width: "50%",
            }}
          >
            <Typography variant="body1">
              I've been a developer for about 6+ years, I've climbed my way up
              from a customer service advisor to a support engineer to a
              software engineer and since then I've been on this amazing journey
              where there is always something to learn. I am well versed with
              not only the dev world but everything outside and everything in
              between. Well through my whole career my only goal has been to
              learn, to do the right thing, and be better than my past self.
            </Typography>
          </Box>
        </Box>
      </Zoom>
    </Box>
  );
}

export default AboutMe;
