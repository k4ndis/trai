// src/components/sidebar.tsx
"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
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
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const information = useInformationStore((state) => state.fields)

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      el.focus()
    }
  }

  return (
    <aside className="w-64 border-r bg-muted/40 overflow-y-auto p-4 hidden md:block">
      <Accordion type="multiple" className="w-full">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger className="text-base font-semibold hover:bg-accent hover:text-accent-foreground rounded px-2 no-underline">
              <Link
                href={`/${section.id}`}
                className={cn(
                  "text-base font-semibold hover:text-primary",
                  pathname === `/${section.id}` && "text-primary"
                )}
              >
                {section.label}
              </Link>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 pl-2 text-sm">
                {section.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleScrollTo(item)}
                      className="text-left w-full text-sm hover:bg-accent hover:text-accent-foreground rounded px-1"
                    >
                      {item}
                    </button>
                    {information[item.toLowerCase().replace(/ /g, "")] && (
                      <div className="text-muted-foreground text-xs mt-0.5">
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
