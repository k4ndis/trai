// src/components/sidebar.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useInformationStore, useUIStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { Sample, TestSequence } from "@/lib/store"
import {
  LayoutDashboard,
  FlaskConical,
  Workflow,
  Settings,
} from "lucide-react"

const sections = [
  {
    id: "information",
    label: "Information",
    icon: LayoutDashboard,
    items: [
      "Report",
      "Project",
      "Product",
      "Product Number",
      "Drawing",
      "DVP",
      "Test",
      "Result",
      "Distribution List",
    ],
  },
  {
    id: "testsamples",
    label: "Samples",
    icon: FlaskConical,
    items: [],
  },
  {
    id: "testprocedure",
    label: "Procedure",
    icon: Workflow,
    items: ["Test Type", "Test Sequence"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: [],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const information = useInformationStore((state) => state.fields)
  const samples = useInformationStore((state) => state.samples)
  const testSequences = useInformationStore((state) => state.testSequences)
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore()
  const [activeField, setActiveField] = useState<string | null>(null)

  useEffect(() => {
    const handle = () => {
      const activeEl = document.activeElement as HTMLElement | null
      if (activeEl?.id) {
        setActiveField(activeEl.id)
      }
    }
    window.addEventListener("focusin", handle)
    return () => window.removeEventListener("focusin", handle)
  }, [])

  const handleNavigation = (sectionId: string) => {
    if (pathname !== `/${sectionId}`) {
      router.push(`/${sectionId}`)
    }
    closeMobileSidebar()
  }

  const handleScrollTo = (id: string, sectionId: string) => {
    const idNormalized = id.toLowerCase().replace(/ /g, "")
    const scrollAndFocus = () => {
      const el = document.getElementById(idNormalized)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        el.focus()
        closeMobileSidebar()
      } else {
        requestAnimationFrame(scrollAndFocus)
      }
    }

    if (pathname === `/${sectionId}`) {
      setTimeout(scrollAndFocus, 100)
    } else {
      router.push(`/${sectionId}`)
      setTimeout(scrollAndFocus, 500)
    }
  }

  return (
    <>
      <aside className="group fixed top-14 left-0 z-10 flex h-screen flex-col border-r bg-muted/40 transition-all duration-300 hover:w-64 w-16 overflow-hidden hidden md:flex">
        <nav className="flex flex-col gap-2 p-4">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.id} className="relative">
                <button
                  onClick={() => handleNavigation(section.id)}
                  className="flex items-center gap-4 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate text-left text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {section.label}
                  </span>
                </button>
                {/* Dynamische Sub-Listen */}
                {section.id === "testsamples" && samples.length > 0 && (
                  <div className="ml-10 mt-1 flex flex-col gap-1">
                    {samples.map((sample, index) => (
                      <button
                        key={sample.id}
                        onClick={() => handleScrollTo(`Sample ${index + 1}`, section.id)}
                        className="text-xs text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded px-1 text-left opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        #{index + 1} · {sample.productNumber}
                      </button>
                    ))}
                  </div>
                )}
                {section.id === "testprocedure" && testSequences.length > 0 && (
                  <div className="ml-10 mt-1 flex flex-col gap-1">
                    {testSequences.map((seq, index) => (
                      <button
                        key={seq.id}
                        onClick={() => handleScrollTo("testsequence", section.id)}
                        className="text-xs text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded px-1 text-left opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        #{index + 1} {seq.type || "(unnamed)"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileSidebar}
        >
          <aside
            className="w-64 h-full bg-background border-r p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => handleNavigation(section.id)}
                    className="flex items-center gap-4 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full"
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
