// src/app/layout.tsx
import "./globals.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Topbar } from "@/components/topbar"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "sonner"
import MuiThemeWrapper from "@/components/MuiThemeWrapper"

export const metadata = {
  title: "TRAI",
  description: "Technical Report and Analysis Interface",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <MuiThemeWrapper>
            <div className="flex flex-col min-h-screen">
              <div className="fixed top-0 left-0 right-0 z-20">
                <Topbar />
              </div>
              <div className="md:flex pt-14 h-screen">
                <Sidebar />
                <main className="w-full md:ml-64 flex-1 overflow-y-auto p-6">
                  {children}
                </main>
              </div>
            </div>
            <Toaster position="top-right" />
          </MuiThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
