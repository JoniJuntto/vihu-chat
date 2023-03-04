import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Chat from "./Views/Chat";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Poppins",
      fontSize: "1rem",
      color: "#fff",
    },
    h1: {
      fontWeight: 800,
      fontSize: "3rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 400,
      fontSize: "1.5rem",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1.5rem",
    },
    body2: {
      fontWeight: 300,
      fontSize: "1.25rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "0.5rem",
          padding: "1rem",
        },
        contained: {
          backgroundColor: "#00CEFF",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#a4e6f7",
          },
        },
        outlined: {
          color: "#000",
          borderColor: "#000",
          "&:hover": {
            backgroundColor: "#fff",
            borderColor: "#000",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "#fff",
          backgroundColor: "#282D37",
          borderRadius: "0.5rem",
          "& label.Mui-focused": {
            color: "white",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "0.5rem",
            },
            "&.Mui-focused fieldset": {
              border: "1px solid white",
            },
          },

          "& .MuiOutlinedInput-input": {
            color: "white",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#1976D2",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
