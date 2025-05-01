// src/app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Topbar } from "@/components/topbar"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "sonner"

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import muiTheme from "@/lib/mui_theme" // <-- dein MUI Theme mit TRAI-Farbe

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TRAI",
  description: "Technical Report and Analysis Interface",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className="flex flex-col min-h-screen">
              {/* Fixierte Topbar */}
              <div className="fixed top-0 left-0 right-0 z-20">
                <Topbar />
              </div>

              {/* Sidebar + Hauptinhalt darunter */}
              <div className="md:flex pt-14 h-screen">
                <Sidebar />
                <main className="w-full md:ml-64 flex-1 overflow-y-auto p-6">
                  {children}
                </main>
              </div>
            </div>

            {/* Toaster für Notifications */}
            <Toaster position="top-right" />
          </MuiThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
