import Search from "./components/search";
import { ThemeProvider, createTheme } from "@mui/material";
// import DocsEx from "./components/docsEx";
// import AllInOne from "./components/allInOne";
import "./App.css";

const theme = createTheme({});

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Search />
      </ThemeProvider>
    </>
  );
};

export default App;
