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
import { useInformationStore } from "@/lib/store"
import { useUIStore } from "@/lib/store"

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { toggleMobileSidebar } = useUIStore()  

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
  }, [router]) // ✅ router als Abhängigkeit hinzugefügt  

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSave = async () => {
    if (!user) return alert("You are not logged in.")
  
    const { fields, testSequences, samples } = useInformationStore.getState()
  
    const reportId = fields.report
    if (!reportId) return alert("Please enter a Report ID")
  
    const { error } = await supabase.from("test_reports").upsert([
      {
        id: reportId,
        user_id: user.id,
        fields,
        test_sequences: testSequences,
        test_samples: samples,
        created_at: new Date().toISOString(),
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
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileSidebar} // ✅ Das ist neu!
        >
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
            <Button variant="default" size="sm" onClick={handleSave}>
              Save
            </Button>
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
