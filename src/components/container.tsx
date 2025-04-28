// src/components/container.tsx
"use client"

import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "px-4 md:px-8 lg:px-12 py-4 flex justify-center",
        className
      )}
    >
      <div className="w-full max-w-7xl" {...props} />
    </div>
  )
}
