// src/components/MuiThemeWrapper.tsx
"use client"

import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { getMuiTheme } from "@/lib/mui_theme"

export default function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const muiTheme = getMuiTheme(resolvedTheme === "dark" ? "dark" : "light")

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
