import AboutMe from "./components/AboutMe";
import BackgroundParticles from "./components/BackgroundParticles";
import EducationAndExperience from "./components/EducationAndExpierence";
import Introduction from "./components/Introduction";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  return (
    <>
      <BackgroundParticles />
      <Introduction />
      <AboutMe />
      <Skills />
      <EducationAndExperience />
      <Projects />
    </>
  );
}

export default App;
