"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/lib/store"
import { useEffect, useState } from "react"
import {
  House,
  Boxes,
  Combine,
  Circle,
  CircleDot,
  ClipboardList,
} from "lucide-react"

const sections = [
  { id: "overview", label: "Overview", icon: <House size={20} /> },
  { id: "testsamples", label: "Samples", icon: <Boxes size={20} /> },
  { id: "testprocedure", label: "Procedure", icon: <Combine size={20} /> },
  { id: "evaluation", label: "Evaluation", icon: <Circle size={20} /> },
  { id: "results", label: "Results", icon: <CircleDot size={20} /> },
  { id: "review", label: "Review", icon: <ClipboardList size={20} /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
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

  return (
    <>
      <aside
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className={`${collapsed ? "w-20" : "w-64"} h-screen fixed top-14 left-0 z-10 border-r bg-muted/40 transition-all duration-300 overflow-y-auto p-4 hidden md:block`}
      >
        <SidebarContent
          activeField={activeField}
          router={router}
          pathname={pathname}
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
              activeField={activeField}
              router={router}
              pathname={pathname}
              collapsed={false}
            />
          </aside>
        </div>
      )}
    </>
  )
}

function SidebarContent({
  activeField,
  router,
  pathname,
  collapsed,
}: {
  activeField: string | null
  router: ReturnType<typeof useRouter>
  pathname: string
  collapsed: boolean
}) {
  return (
    <ul className="space-y-1">
      {sections.map((section) => (
        <li key={section.id}>
          <button
            onClick={() => router.push(`/${section.id}`)}
            className={cn(
              "group w-full flex items-center gap-2 text-base font-semibold rounded px-2 py-2 no-underline transition-all",
              pathname.includes(section.id)
                ? "border-l-2 border-primary bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              {section.icon}
              {!collapsed && section.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
