// src/app/page.tsx
"use client"

import { useInformationStore } from "@/lib/store"
import InformationPage from "./information/page"

export default function HomePage() {
  return (
    <div className="prose dark:prose-invert">
      <h1>Welcome to TRAI</h1>
      <p>Select a section from the sidebar to begin.</p>
    </div>
  )
  
}