// src/components/sidebar.tsx
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useInformationStore, useUIStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { Sample, TestSequence } from "@/lib/store"
import { House, Boxes, Combine } from "lucide-react"
import { ReactNode } from "react"

const sections = [
  {
    id: "information",
    label: "Information",
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
    items: [],
  },
  {
    id: "testprocedure",
    label: "Procedure",
    items: ["Test Type", "Test Sequence"],
  },
]

// Neue Icon Map für Hauptpunkte
const sectionIconMap: Record<string, ReactNode> = {
  Information: <House size={20} />,
  Samples: <Boxes size={20} />,
  Procedure: <Combine size={20} />,
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const information = useInformationStore((state) => state.fields)
  const samples = useInformationStore((state) => state.samples)
  const testSequences = useInformationStore((state) => state.testSequences)
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore()
  const [activeField, setActiveField] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(true)

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
      <aside
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className={`${collapsed ? "w-20" : "w-64"} h-screen fixed top-14 left-0 z-10 border-r bg-muted/40 transition-all duration-300 overflow-y-auto p-4 hidden md:block`}
      >
        <SidebarContent
          information={information}
          samples={samples}
          testSequences={testSequences}
          activeField={activeField}
          handleScrollTo={handleScrollTo}
          router={router}
          collapsed={collapsed}
        />
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
            <SidebarContent
              information={information}
              samples={samples}
              testSequences={testSequences}
              activeField={activeField}
              handleScrollTo={handleScrollTo}
              router={router}
              collapsed={false}
            />
          </aside>
        </div>
      )}
    </>
  )
}

type SidebarContentProps = {
  information: Record<string, string>
  samples: Sample[]
  testSequences: TestSequence[]
  activeField: string | null
  handleScrollTo: (id: string, sectionId: string) => void
  router: ReturnType<typeof useRouter>
  collapsed: boolean
}

function SidebarContent({
  information,
  samples,
  testSequences,
  activeField,
  handleScrollTo,
  router,
  collapsed,
}: SidebarContentProps) {
  const pathname = usePathname()

  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/${section.id}`)
            }}
            className={cn(
              "group w-full flex items-center gap-2 text-base font-semibold rounded px-2 py-2 no-underline transition-all",
              pathname.includes(section.id)
                ? "border-l-2 border-primary bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              {sectionIconMap[section.label]}
              {!collapsed && section.label}
            </span>
          </AccordionTrigger>

          {section.id === "testsamples" ? (
            <AccordionContent>
              <ul className="space-y-1 pl-2 text-sm">
                {samples.map((sample, index) => {
                  const label = `#${index + 1} · ${sample.productNumber} · ${sample.productionDate} · ${sample.serialNumber}`
                  return (
                    <li key={sample.id}>
                      <button
                        onClick={() => handleScrollTo(`Sample ${index + 1}`, section.id)}
                        className={cn(
                          "text-left w-full text-xs text-muted-foreground rounded px-1 hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {collapsed ? null : label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </AccordionContent>
          ) : section.id === "testprocedure" ? (
            <AccordionContent>
              <ul className="space-y-1 pl-2 text-sm">
                {section.items.map((item: string) => (
                  <li key={item}>
                    <button
                      onClick={() => handleScrollTo(item, section.id)}
                      className={cn(
                        "text-left w-full text-sm rounded px-1",
                        activeField?.toLowerCase().replace(/ /g, "") === item.toLowerCase().replace(/ /g, "")
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {collapsed ? null : item}
                    </button>
                    {item === "Test Sequence" && testSequences.length > 0 && (
                      <ul className="pl-2 mt-1 space-y-1">
                        {testSequences.map((seq, index) => (
                          <li key={seq.id}>
                            <button
                              onClick={() => handleScrollTo("testsequence", section.id)}
                              className="text-xs text-muted-foreground hover:text-accent-foreground hover:bg-accent w-full text-left rounded px-1"
                            >
                              {collapsed ? null : `#${index + 1} ${seq.type || "(unnamed)"}`}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {!collapsed && information[item.toLowerCase().replace(/ /g, "")] && (
                      <div className="text-muted-foreground text-xs mt-0.5 pl-1">
                        {information[item.toLowerCase().replace(/ /g, "")]}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          ) : section.items.length > 0 ? (
            <AccordionContent>
              <ul className="space-y-1 pl-2 text-sm">
                {section.items.map((item: string) => (
                  <li key={item}>
                    <button
                      onClick={() => handleScrollTo(item, section.id)}
                      className={cn(
                        "text-left w-full text-sm rounded px-1",
                        activeField?.toLowerCase().replace(/ /g, "") === item.toLowerCase().replace(/ /g, "")
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {collapsed ? null : item}
                    </button>
                    {!collapsed && information[item.toLowerCase().replace(/ /g, "")] && (
                      <div className="text-muted-foreground text-xs mt-0.5 pl-1">
                        {information[item.toLowerCase().replace(/ /g, "")]}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          ) : null}
        </AccordionItem>
      ))}
    </Accordion>
  )
}
