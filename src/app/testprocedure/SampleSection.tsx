"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import ImageUploader from "@/components/image"

export interface SampleImage {
  url: string
  label: string
}

export interface Sample {
  id: number
  productNumber: string
  productionDate: string
  serialNumber: string
  features: string
  images: SampleImage[]
}

export function SampleSection({
  samples,
  updateSample,
  addSample,
  removeItem,
  updateSampleImages,
}: {
  samples: Sample[]
  updateSample: (id: number, field: keyof Sample, value: string) => void
  addSample: () => void
  removeItem: (id: number, isSample?: boolean) => void
  updateSampleImages: (sampleId: number, images: SampleImage[]) => void
}) {
  const handleDeleteImage = (sampleId: number, index: number, url: string) => {
    const updatedImages = [...samples.find((s) => s.id === sampleId)!.images]
    updatedImages.splice(index, 1)
    updateSampleImages(sampleId, updatedImages)

    const path = url.split("/public/")[1] // z. B. trai/sample-xxxx.jpg
    if (path) {
      fetch("/api/delete_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      })
    }
  }

  return (
    <div
      id="testsamples"
      tabIndex={-1}
      className="rounded-xl p-4 mb-6"
    >
      <Label className="text-lg mb-4 block">Test Samples</Label>

      {samples.map((sample, index) => (
        <div key={sample.id} className="border rounded p-4 space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <strong className="text-blue-400 text-lg">Sample {index + 1}</strong>
            <Button variant="destructive" size="sm" onClick={() => removeItem(sample.id, true)}>
              ✖
            </Button>
          </div>

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

            <div className="md:col-span-2">
              <ImageUploader
                sampleId={sample.id}
                onUpload={(url, label) => {
                  const newImages = [...(sample.images || []), { url, label }]
                  updateSampleImages(sample.id, newImages)
                }}
              />
            </div>

            {sample.images?.length > 0 && (
              <div className="md:col-span-2">
                <Label className="mb-1 block">Uploaded Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {sample.images.map((img, i) => (
                    <div key={i} className="border rounded overflow-hidden relative group">
                      <img src={img.url} alt={img.label} className="w-full h-32 object-cover" />
                      <div className="text-xs p-1 text-muted-foreground">{img.label}</div>
                      <button
                        onClick={() => handleDeleteImage(sample.id, i, img.url)}
                        className="absolute bottom-1 right-1 text-xs bg-black bg-opacity-50 px-1 rounded text-white"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <Button onClick={addSample} className="text-xs px-3 py-2 rounded w-fit">
        + Add Sample
      </Button>
    </div>
  )
}
