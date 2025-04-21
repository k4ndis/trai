"use client"

import { Button } from "@/components/ui/button"
import { LogIn, Menu, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useInformationStore, useUIStore } from "@/lib/store"
import { UserMenu } from "@/components/user"
import { SearchDialog } from "@/components/search"

export function Topbar() {
  const [user, setUser] = useState<User | null>(null)
  const { toggleMobileSidebar, openSearch } = useUIStore()
  const router = useRouter()

  useEffect(() => {
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
      if (_event === "SIGNED_IN") router.push("/")
    })

    return () => subscription.unsubscribe()
  }, [router])

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

    if (error) alert("Error while saving: " + error.message)
    else alert("Report saved successfully ✅")
  }

  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 px-2 py-1 border-b bg-background shadow-sm">
        {/* Left: Burger + Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="relative w-16 h-12">
            <Image src="/logo.png" alt="TRAI Logo" fill className="object-contain" priority />
          </Link>
        </div>

        {/* Right: Search Icon + Save + UserMenu */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={openSearch}>
            <Search className="h-5 w-5" />
          </Button>

          {user && (
            <Button variant="default" size="sm" onClick={handleSave}>
              Save
            </Button>
          )}

          {user ? (
            <UserMenu />
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      <SearchDialog />
    </>
  )
}