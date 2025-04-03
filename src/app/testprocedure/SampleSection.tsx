// src/app/testprocedure/SampleSection.tsx
"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Sample {
  id: number;
  productNumber: string;
  productionDate: string;
  serialNumber: string;
  features: string;
}

export function SampleSection({
  samples,
  updateSample,
  addSample,
  removeItem
}: {
  samples: Sample[],
  updateSample: (id: number, field: keyof Sample, value: string) => void,
  addSample: () => void,
  removeItem: (id: number, isSample?: boolean) => void
}) {
  return (
    <div
      id="testsamples"
      tabIndex={-1}
      className="border border-gray-700 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
    >
      <Label className="text-lg">Test Samples</Label>
      {samples.map((sample, index) => (
        <div key={sample.id} className="border rounded p-4 space-y-2">
          <div className="flex justify-between">
          <strong className="text-blue-400 text-lg">Sample {index + 1}</strong>
            <Button variant="destructive" size="sm" onClick={() => removeItem(sample.id, true)}>✖</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Product Number" 
              value={sample.productNumber}
              onChange={(e) => updateSample(sample.id, "productNumber", e.target.value)}
            />
            <Input 
              placeholder="Production Date" 
              value={sample.productionDate}
              onChange={(e) => updateSample(sample.id, "productionDate", e.target.value)}
            />
            <Input 
              placeholder="Serial Number" 
              value={sample.serialNumber}
              onChange={(e) => updateSample(sample.id, "serialNumber", e.target.value)}
            />
            <Textarea 
              placeholder="Features / Deviations" 
              className="col-span-2"
              value={sample.features}
              onChange={(e) => updateSample(sample.id, "features", e.target.value)}
            />
          </div>
        </div>
      ))}
      <Button
        onClick={addSample}
        className="text-xs px-2 py-1 rounded w-fit"
      >
        + Add Sample
      </Button>
    </div>
  )
}
