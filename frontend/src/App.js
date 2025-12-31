import React from "react";
import ResumeMatcher from "./components/ResumeMatcher";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", 
    },
    background: {
      default: "#f4f7fb", 
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ResumeMatcher />
    </ThemeProvider>
  );
}

export default App;
