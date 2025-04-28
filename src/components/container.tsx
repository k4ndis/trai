// src/components/container.tsx
"use client"

import { cn } from "@/lib/utils"

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 md:px-8 lg:px-12 py-4 flex justify-center",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-7xl">
        {children}
      </div>
    </div>
  )
}
