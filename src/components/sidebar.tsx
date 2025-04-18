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
    id: "testprocedure",
    label: "Test Procedure",
    items: ["Test Type", "Test Sequence", "Test Samples"],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const information = useInformationStore((state) => state.fields)
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
      {/* Desktop Sidebar */}
      <aside className="w-64 h-screen fixed top-14 left-0 z-10 border-r bg-muted/40 overflow-y-auto p-4 hidden md:block">
        <SidebarContent
          information={information}
          activeField={activeField}
          handleScrollTo={handleScrollTo}
          router={router}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
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
              activeField={activeField}
              handleScrollTo={handleScrollTo}
              router={router}
            />
          </aside>
        </div>
      )}
    </>
  )
}

type SidebarContentProps = {
  information: Record<string, string>
  activeField: string | null
  handleScrollTo: (id: string, sectionId: string) => void
  router: ReturnType<typeof useRouter>
}

function SidebarContent({
  information,
  activeField,
  handleScrollTo,
  router,
}: SidebarContentProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "group w-full flex justify-between items-center text-base font-semibold hover:bg-accent hover:text-accent-foreground rounded px-2 py-2 no-underline"
            )}
          >
            <span
              className="cursor-pointer w-full text-left"
              onClick={() => router.push(`/${section.id}`)}
            >
              {section.label}
            </span>
          </AccordionTrigger>

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
                    {item}
                  </button>
                  {information[item.toLowerCase().replace(/ /g, "")] && (
                    <div className="text-muted-foreground text-xs mt-0.5 pl-1">
                      {information[item.toLowerCase().replace(/ /g, "")]}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
