// src/components/topbar.tsx_test
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sun, Moon, LogIn, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"


export function Topbar() {
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setMounted(true)
  
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
  
    getUser()
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
  
      // Nach erfolgreichem Login zur Startseite weiterleiten
      if (session?.user) {
        window.location.href = "/"
      }      
    })
  
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="flex items-center justify-between border-b pl-1 pr-6 py-1 bg-background shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="relative w-16 h-12">
          <Image
            src="/logo.png"
            alt="TRAI Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
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
        {user ? (
  <div className="flex items-center gap-3">
    <span className="text-sm text-muted-foreground">{user.email}</span>
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  </div>
        ) : (
          <Link href="/auth">
            <Button variant="outline" size="sm">
              <LogIn className="h-4 w-4 mr-2" /> Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
