import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
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
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResumeMatcher />
    </ThemeProvider>
  );
}


export default App;
