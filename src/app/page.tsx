// src/app/page.tsx
"use client"

import { useInformationStore } from "@/lib/store"
import InformationPage from "./information/page"

export default function HomePage() {
  const activeSection = useInformationStore((state) => state.activeSection)

  return (
    <div className="prose dark:prose-invert">
      {!activeSection && (
        <>
          <h1>Welcome to TRAI</h1>
          <p>Select a section from the sidebar to begin.</p>
        </>
      )}

      {activeSection === "information" && <InformationPage />}
    </div>
  )
}