"use client"

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import muiTheme from "@/lib/mui_theme"

export default function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={muiTheme}>
      {children}
    </MuiThemeProvider>
  )
}
