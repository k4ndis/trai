// src/app/information/page.tsx
"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useInformationStore } from "@/lib/store"

export default function InformationPage() {
  
  const updateField = useInformationStore((state) => state.updateField)
  const fields = useInformationStore((state) => state.fields)
  const router = useRouter()
  
    const [distribution, setDistribution] = useState<string[]>(() => {
    const savedList = fields.distributionlist || "";
    return savedList ? savedList.split(", ").filter(Boolean) : [];
  });

  const handleChange = (field: string, value: string) => {
    const fieldId = field.toLowerCase().replace(/ /g, "");
    updateField(fieldId, value);
  }

  const toggleSelection = (value: string) => {
    setDistribution((prev) => {
      const newSelection = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      return newSelection;
    });
  }

  useEffect(() => {
    updateField("distributionlist", distribution.join(", "));
  }, [distribution, updateField]);

  const formFields = [
    "Report",
    "Project",
    "Product",
    "Product Number",
    "Drawing",
    "DVP",
    "Test",
    "Result",
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((label) => {
          const fieldId = label.toLowerCase().replace(/ /g, "");
          return (
            <div key={label}>
              <Label className="mb-2 block" htmlFor={fieldId}>
                {label}
              </Label>
              <Textarea
                id={fieldId}
                onChange={(e) => handleChange(label, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()} info`}
                className="min-h-[2.5rem] resize-y overflow-hidden"
                value={fields[fieldId] || ""}
              />
            </div>
          );
        })}

        <div className="md:col-span-2">
          <Label className="mb-2 block">Distribution List</Label>
          <div className="flex flex-wrap gap-4 mb-2">
            {["Bonnet", "Brenner", "Neuber", "Schabinger"].map((person) => (
              <label 
                key={person} 
                className="flex items-center gap-2 text-sm"
                htmlFor={`distribution-${person}`}
              >
                <Checkbox
                  id={`distribution-${person}`}
                  checked={distribution.includes(person)}
                  onCheckedChange={() => toggleSelection(person)}
                />
                {person}
              </label>
            ))}
          </div>

          <Textarea
            className="min-h-[2.5rem] resize-y overflow-hidden"
            value={distribution.join(", ")}
            readOnly
            aria-label="Selected distribution list"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push("/testprocedure")}
          className="mt-6 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-foreground border border-foreground hover:bg-accent"
        >
          Continue with Test Procedure
        </button>
      </div>
    </div>
  );
}