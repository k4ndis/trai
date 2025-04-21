// src/components/search.tsx
"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useUIStore } from "@/lib/store"

export function SearchDialog() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
    }
  }, [isSearchOpen])

  return (
    <Dialog open={isSearchOpen} onOpenChange={closeSearch}>
      <DialogContent className="sm:max-w-md w-full">
        <Input
          ref={inputRef}
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg"
        />
        {/* Optional: Ergebnisse anzeigen */}
      </DialogContent>
    </Dialog>
  )
}
