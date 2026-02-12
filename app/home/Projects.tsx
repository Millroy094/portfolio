"use client";
import { GitHub } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createTheme,
  Grid,
  Typography,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import { useWebsiteData } from "@/context/WebsiteData";

function Projects() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const { data } = useWebsiteData();

  return (
    data.projects &&
    data.projects.length > 0 && (
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
        <Grid
          container
          justifyContent={{ lg: "start", md: "center", sm: "center", xs: "center" }}
          spacing={1}
        >
          <Typography
            component="h2"
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
            {data.projects?.map((project) => (
              <Grid key={project.name} container size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                <Card
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    minHeight: "250px",
                  }}
                >
                  <CardHeader title={project.name} />
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
        </ThemeProvider>
      </Grid>
    )
  );
}

export default Projects;
