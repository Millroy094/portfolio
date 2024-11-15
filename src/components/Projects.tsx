import { GitHub } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createTheme,
  Grid2 as Grid,
  Typography,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { projects } from "../configuration";

function Projects() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

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
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Grid container spacing={2}>
          {projects?.map(
            (project: { title: string; description: string; url: string }) => (
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
            )
          )}
        </Grid>
      </ThemeProvider>
    </Grid>
  );
}

export default Projects;
