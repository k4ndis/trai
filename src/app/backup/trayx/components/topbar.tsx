// src/components/topbar.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sun, Moon, LogIn, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center justify-between border-b px-6 py-3 bg-background shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">TRAI</Link>
      </div>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        {mounted && (
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> 
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
        <Button variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-2" /> Sign In
        </Button>
      </div>
    </div>
  )
}
