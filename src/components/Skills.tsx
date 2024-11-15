import { Grid2 as Grid, Typography } from "@mui/material";
import StackIcon from "tech-stack-icons";
import {
  SiDotnet,
  SiExpress,
  SiGithubactions,
  SiHelm,
  SiTerraform,
} from "@icons-pack/react-simple-icons";
import Lottie from "react-lottie";
import SkillsLottie from "../lotties/skills.json";
import GrowOnHover from "../hoc/GrowOnHover";

function Skills() {
  const skills = [
    <StackIcon key="reactjs" name="reactjs" style={{ width: "40px" }} />,
    <StackIcon key="redux" name="redux" style={{ width: "40px" }} />,
    <StackIcon key="nodejs" name="nodejs" style={{ width: "40px" }} />,
    <StackIcon key="typescript" name="typescript" style={{ width: "40px" }} />,
    <SiExpress key="express" size={40} color="#ffffff" />,
    <StackIcon key="graphql" name="graphql" style={{ width: "40px" }} />,
    <StackIcon key="go" name="go" style={{ width: "40px" }} />,
    <StackIcon key="java" name="java" style={{ width: "40px" }} />,
    <StackIcon key="php" name="php" style={{ width: "40px" }} />,
    <StackIcon key="laravel" name="laravel" style={{ width: "40px" }} />,
    <StackIcon key="csharp" name="csharp" style={{ width: "40px" }} />,
    <SiDotnet key="dotnet" size={40} color="#2088FF" />,
    <StackIcon key="jest" name="jest" style={{ width: "40px" }} />,
    <StackIcon key="cypress" name="cypress" style={{ width: "40px" }} />,
    <StackIcon key="playwright" name="playwright" style={{ width: "40px" }} />,
    <StackIcon key="mongodb" name="mongodb" style={{ width: "40px" }} />,
    <StackIcon key="redis" name="redis" style={{ width: "40px" }} />,
    <StackIcon key="mysql" name="mysql" style={{ width: "40px" }} />,
    <StackIcon key="postgresql" name="postgresql" style={{ width: "40px" }} />,
    <StackIcon key="docker" name="docker" style={{ width: "40px" }} />,
    <StackIcon key="kubernetes" name="kubernetes" style={{ width: "40px" }} />,
    <SiHelm key="helm" size={40} color="#0F1689" />,
    <SiTerraform key="terraform" size={40} color="#844FBA" />,
    <SiGithubactions key="githubactions" size={40} color="#2088FF" />,
    <StackIcon key="aws" name="aws" style={{ width: "40px" }} />,
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SkillsLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ zIndex: 10, position: "relative", marginBottom: "60px" }}
    >
      <Grid container size={{ md: 3, sm: 0, xs: 0 }}>
        <Lottie options={defaultOptions} height={400} width={400} />
      </Grid>
      <Grid container size={{ md: 9, sm: 12, xs: 12 }} sx={{ padding: "40px" }}>
        <Grid container spacing={2}>
          <Typography
            variant="overline"
            fontWeight="bold"
            fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
            sx={{
              display: "inline-block",
            }}
          >
            Technology &
          </Typography>
          <Typography
            variant="overline"
            fontWeight="bold"
            fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
            sx={{
              color: "#d32f2f",
              display: "inline-block",
            }}
          >
            Skills
          </Typography>
        </Grid>
        <Grid container spacing={1}>
          {skills?.map((skill: JSX.Element) => (
            <Grid
              container
              key={skill.key}
              size={{ lg: 1, md: 2, sm: 2, xs: 2 }}
            >
              <GrowOnHover scale={1.5}>{skill}</GrowOnHover>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Skills;
