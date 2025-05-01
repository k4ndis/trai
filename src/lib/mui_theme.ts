// src/lib/mui_theme.ts
import { createTheme } from "@mui/material/styles"

export const getMuiTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#00e5c0", // Deine TRAI-Farbe
      },
      background: {
        default: mode === "dark" ? "#0f172a" : "#ffffff",
        paper: mode === "dark" ? "#1e293b" : "#f8fafc",
      },
    },
    shape: {
      borderRadius: 2,
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  })
