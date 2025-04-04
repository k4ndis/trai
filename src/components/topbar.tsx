// src/components/topbar.tsx
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
import { useRouter } from "next/navigation"
import { useInformationStore } from "@/lib/store" // für Information-Daten

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const information = useInformationStore((state) => state.fields)

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

      if (_event === "SIGNED_IN") {
        router.push("/")
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

  const handleSave = async () => {
    if (!user) return alert("You are not logged in.")

    const reportId = information.report // Das Feld „Report“ aus dem Store
    if (!reportId) return alert("Please enter a Report ID")

    const { error } = await supabase.from("test_reports").upsert([
      {
        id: reportId,
        user_id: user.id,
        fields: information,
        created_at: new Date().toISOString(),
        // test_sequences und test_samples folgen später
      },
    ])

    if (error) {
      alert("Error while saving: " + error.message)
    } else {
      alert("Report saved successfully ✅")
    }
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
  
        {/* 👇 Save Button direkt nach dem Logo */}
        {user && (
          <Button variant="default" size="sm" onClick={handleSave}>
            Save
          </Button>
        )}
      </div>
  
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
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
