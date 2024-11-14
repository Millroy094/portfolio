import { Box, Typography } from "@mui/material";
import { Zoom } from "react-awesome-reveal";
import StackIcon from "tech-stack-icons";

function Skills() {
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
            Technology &
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
            Skills
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            padding: "30px 240px 0",
          }}
        >
          <StackIcon name="reactjs" />
          <StackIcon name="redux" />
          <StackIcon name="nodejs" />
          <StackIcon name="typescript" />
          <StackIcon name="graphql" />
          <StackIcon name="go" />
          <StackIcon name="php" />
          <StackIcon name="laravel" />
          <StackIcon name="jest" />
          <StackIcon name="playwright" />
          <StackIcon name="cypress" />
          <StackIcon name="mongodb" />
          <StackIcon name="mysql" />
          <StackIcon name="postgresql" />
          <StackIcon name="docker" />
          <StackIcon name="kubernetes" />
        </Box>
      </Zoom>
    </Box>
  );
}

export default Skills;
