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

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const information = useInformationStore((state) => state.fields)
  const samples = useInformationStore((state) => state.samples)
  const testSequences = useInformationStore((state) => state.testSequences)
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore()
  const [activeField, setActiveField] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

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
      <aside className={`h-screen fixed top-14 left-0 z-10 border-r bg-background transition-all duration-300 overflow-y-auto p-4 hidden md:block ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>
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
          <aside className="w-64 h-full bg-background border-r transition-all duration-300 p-4" onClick={(e) => e.stopPropagation()}>
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
              "group w-full flex justify-between items-center text-sm font-medium rounded-md px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            )}
          >
            <span className="cursor-pointer w-full text-left">
              {collapsed ? null : section.label}
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
                          "text-left w-full text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 rounded-md px-2 py-1"
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
                        "text-left w-full text-sm rounded-md px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200",
                        activeField?.toLowerCase().replace(/ /g, "") === item.toLowerCase().replace(/ /g, "")
                          ? "bg-accent text-foreground font-medium"
                          : ""
                      )}
                    >
                      {collapsed ? null : item}
                    </button>
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
                        "text-left w-full text-sm rounded-md px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200",
                        activeField?.toLowerCase().replace(/ /g, "") === item.toLowerCase().replace(/ /g, "")
                          ? "bg-accent text-foreground font-medium"
                          : ""
                      )}
                    >
                      {collapsed ? null : item}
                    </button>
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
