// src/app/information/page.tsx
"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useInformationStore } from "@/lib/store"

export default function InformationPage() {
  const [distribution, setDistribution] = useState<string[]>([])
  const router = useRouter()
  const update = useInformationStore((state) => state.updateField)

  const handleChange = (field: string, value: string) => {
    update(field.toLowerCase().replace(/ /g, ""), value)
  }

  const toggleSelection = (value: string) => {
    setDistribution((prev) => {
      const newSelection = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
      return newSelection
    })
  }

  useEffect(() => {
    update("distributionlist", distribution.join(", "))
  }, [distribution])

  const fields = [
    "Report",
    "Project",
    "Product",
    "Product Number",
    "Drawing",
    "DVP",
    "Test",
    "Result",
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((label) => (
          <div key={label}>
            <Label className="mb-2 block" htmlFor={label}>{label}</Label>
            <Textarea
              id={label}
              onChange={(e) => handleChange(label, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()} info`}
              className="resize-y"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <Label className="mb-2 block">Distribution List</Label>
          <div className="flex flex-wrap gap-4 mb-2">
            {["Bonnet", "Brenner", "Neuber", "Schabinger"].map((person) => (
              <label key={person} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={distribution.includes(person)}
                  onCheckedChange={() => toggleSelection(person)}
                />
                {person}
              </label>
            ))}
          </div>

          <Textarea
            className="mt-1"
            value={distribution.join(", ")}
            readOnly
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push("/testprocedure")}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-background dark:text-white hover:bg-primary/90"
        >
          Continue with Test Procedure
        </button>
      </div>
    </div>
  )
}