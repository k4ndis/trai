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
      <Label className="text-lg mb-4 block">Test Samples</Label>

      {samples.map((sample, index) => (
        <div key={sample.id} className="border rounded p-4 space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <strong className="text-blue-400 text-lg">Sample {index + 1}</strong>
            <Button variant="destructive" size="sm" onClick={() => removeItem(sample.id, true)}>✖</Button>
          </div>

          {/* Universelles Grid-System */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Product Number</Label>
              <Input 
                placeholder="Product Number" 
                value={sample.productNumber}
                onChange={(e) => updateSample(sample.id, "productNumber", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-1 block">Production Date</Label>
              <Input 
                placeholder="Production Date" 
                value={sample.productionDate}
                onChange={(e) => updateSample(sample.id, "productionDate", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="mb-1 block">Serial Number</Label>
              <Input 
                placeholder="Serial Number" 
                value={sample.serialNumber}
                onChange={(e) => updateSample(sample.id, "serialNumber", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="mb-1 block">Features / Deviations</Label>
              <Textarea 
                placeholder="Features / Deviations" 
                value={sample.features}
                onChange={(e) => updateSample(sample.id, "features", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={addSample}
        className="text-xs px-3 py-2 rounded w-fit"
      >
        + Add Sample
      </Button>
    </div>
  )
}
