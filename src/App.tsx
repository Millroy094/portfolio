import { useEffect } from "react";
import {
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";
import AboutMe from "./components/AboutMe";
import BackgroundParticles from "./components/BackgroundParticles";
import EducationAndExperience from "./components/EducationAndExpierence";
import Introduction from "./components/Introduction";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { Fab, Grid2 as Grid } from "@mui/material";
import { ArrowCircleUp } from "@mui/icons-material";

function App() {
  useEffect(() => {
    Events.scrollEvent.register("begin", (to, element) => {
      console.log("begin", to, element);
    });

    Events.scrollEvent.register("end", (to, element) => {
      console.log("end", to, element);
    });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <>
      <BackgroundParticles />

      <Element name="introduction">
        <Introduction />
      </Element>
      <Element name="aboutme">
        <AboutMe />
      </Element>
      <Element name="skills">
        <Skills />
      </Element>
      <Element name="educationandexperience">
        <EducationAndExperience />
      </Element>
      <Element name="projects">
        <Projects />
      </Element>
      <Grid
        container
        justifyContent="end"
        p={1}
        sx={{
          margin: 0,
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto",
          position: "fixed",
          zIndex: 100,
        }}
      >
        <Fab color="error" aria-label="add" onClick={scrollToTop}>
          <ArrowCircleUp />
        </Fab>
      </Grid>
    </>
  );
}

export default App;
