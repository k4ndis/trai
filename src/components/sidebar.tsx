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
import { useInformationStore } from "@/lib/store"

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
    items: [
      "Test Type",
      "Test Sequence",
      "Test Samples",
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const information = useInformationStore((state) => state.fields)

  const handleScrollTo = (id: string, sectionId: string) => {
    if (pathname === `/${sectionId}`) {
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
          el.focus()
        }
      }, 100)
    } else {
      router.push(`/${sectionId}`)
      setTimeout(() => {
        const checkScroll = () => {
          const el = document.getElementById(id)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" })
            el.focus()
          } else {
            requestAnimationFrame(checkScroll)
          }
        }
        checkScroll()
      }, 300)
    }
  }

  return (
    <aside className="w-64 border-r bg-muted/40 overflow-y-auto p-4 hidden md:block">
      <Accordion type="multiple" className="w-full">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger
              onClick={(e) => {
                e.stopPropagation(); // verhindert Navigation beim Pfeil
              }}
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
                {section.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleScrollTo(item, section.id)}
                      className="text-left w-full text-sm hover:bg-accent hover:text-accent-foreground rounded px-1"
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
    </aside>
  )
}
