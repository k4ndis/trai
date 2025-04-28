// src/components/sidebar.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useInformationStore, useUIStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { Sample, TestSequence } from "@/lib/store"
import {
  LayoutDashboard,
  FlaskConical,
  Workflow,
  Settings,
  Plus,
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
  const samples = useInformationStore((state) => state.samples)
  const testSequences = useInformationStore((state) => state.testSequences)
  const addSample = useInformationStore((state) => state.addSample)
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore()
  const [activeField, setActiveField] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>("information")

  useEffect(() => {
    const handle = () => {
      const activeEl = document.activeElement as HTMLElement | null
      if (activeEl?.id) {
        setActiveField(activeEl.id.toLowerCase().replace(/ /g, ""))
      }
    }
    window.addEventListener("focusin", handle)
    return () => window.removeEventListener("focusin", handle)
  }, [])

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId)
    if (pathname !== `/${sectionId}`) {
      router.push(`/${sectionId}`)
    }
    closeMobileSidebar()
  }

  const handleScrollTo = (id: string) => {
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
    setTimeout(scrollAndFocus, 100)
  }

  const currentSection = sections.find((s) => s.id === activeSection)

  return (
    <>
      {/* Haupt-Sidebar */}
      <aside className="group fixed top-14 left-0 z-10 flex h-screen flex-col border-r bg-muted/40 transition-all duration-300 hover:w-64 w-16 overflow-hidden hidden md:flex">
        <nav className="flex flex-col gap-2 p-4">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => handleNavigation(section.id)}
                className={cn(
                  "flex items-center gap-4 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate text-left text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {section.label}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Sub-Sidebar */}
      <aside className="fixed top-14 left-16 z-10 flex h-screen flex-col border-r bg-muted/20 w-48 md:flex p-4 overflow-y-auto">
        <nav className="flex flex-col gap-2">
          {currentSection?.id === "information" &&
            currentSection.items.map((item) => (
              <button
                key={item}
                onClick={() => handleScrollTo(item)}
                className={cn(
                  "text-left text-sm rounded px-2 py-1",
                  activeField === item.toLowerCase().replace(/ /g, "")
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item}
              </button>
            ))}

          {currentSection?.id === "testsamples" && (
            <>
              <button
                onClick={() => addSample()}
                className="flex items-center gap-2 text-left text-sm text-muted-foreground rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Sample
              </button>
              {samples.map((sample, index) => (
                <button
                  key={sample.id}
                  onClick={() => handleScrollTo(`Sample ${index + 1}`)}
                  className="text-left text-sm text-muted-foreground rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
                >
                  #{index + 1} · {sample.productNumber || "No Product Number"}
                </button>
              ))}
            </>
          )}

          {currentSection?.id === "testprocedure" &&
            testSequences.map((seq, index) => (
              <button
                key={seq.id}
                onClick={() => handleScrollTo("testsequence")}
                className="text-left text-sm text-muted-foreground rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                #{index + 1} {seq.type || "(unnamed)"}
              </button>
            ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
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
