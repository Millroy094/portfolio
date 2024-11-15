import { GitHub } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Typography,
} from "@mui/material";

function Projects() {
  const projects = [
    {
      title: "OpenId Connect Auth Server",
      description:
        "OIDC server with OIDC features it also comes with user management features and additional security features like MFA and Passkey.",
      url: "https://github.com/Millroy094/oauth-server",
    },
    {
      title: "Keycloak Cluster",
      description:
        "My first go at using terraform, AWS, and github actions to build a CI/CD pipeline. The project comprised of deploying a Keycloak docker container into Amazon ECS.",
      url: "https://github.com/Millroy094/keycloak-cluster-aws-terraform",
    },
    {
      title: "Recipe App",
      description:
        "A simple app to store & manage recipes. This was part of a senior developer interview I took on and was by far the best version they saw.",
      url: "https://github.com/Millroy094/recipe-book",
    },
    {
      title: "Travel Planner",
      description:
        "My first Node.JS project and my entry into the web development world. This is a backend api meshing up weather and google maps data together.",
      url: "https://github.com/Millroy094/Travel-Planner",
    },
    {
      title: "Zoo Simulator",
      description:
        "Again part of another interview application is a Zoo simulator designed with PHP backend and React.Js frontend",
      url: "https://github.com/Millroy094/zoo-simulator",
    },
  ];

  return (
    <Grid
      container
      direction="column"
      sx={{
        marginBottom: "60px",
        zIndex: 10,
        position: "relative",
        padding: "0 40px",
      }}
    >
      <Grid container justifyContent="start" spacing={1}>
        <Typography
          variant="overline"
          fontWeight="bold"
          fontSize={{ xs: 20, sm: 20, md: 35, lg: 35 }}
          sx={{
            color: "#d32f2f",
          }}
        >
          Projects
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        {projects?.map((project) => (
          <Grid
            key={project.title}
            container
            size={{ lg: 3, md: 6, sm: 12, xs: 12 }}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <CardHeader title={project.title} />
              <CardContent>
                <Typography>{project.description}</Typography>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  color="error"
                  variant="contained"
                  endIcon={<GitHub />}
                  onClick={() => window.open(project.url, "_blank")}
                >
                  View Repo
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default Projects;
