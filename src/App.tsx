import { Box } from "@mui/material";
import "./App.css";
import BackgroundParticles from "./components/BackgroundParticles";
import Introduction from "./components/Introduction";

function App() {
  return (
    <>
      <BackgroundParticles />
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Introduction />
      </Box>
    </>
  );
}

export default App;
