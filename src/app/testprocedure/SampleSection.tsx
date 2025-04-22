"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import ImageUploader from "@/components/image"
import { supabase } from "@/lib/supabaseClient"

// ✅ Exportierbarer Typ für Verwendung in anderen Dateien
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
  const handleDeleteImage = async (sampleId: number, imageUrl: string) => {
    const filePath = imageUrl.split("/storage/v1/object/public/")[1]
    if (!filePath) return

    const { error } = await supabase.storage.from("trai").remove([filePath])
    if (error) {
      alert("Bild konnte nicht gelöscht werden: " + error.message)
      return
    }

    const updated = samples.map((sample) =>
      sample.id === sampleId
        ? { ...sample, images: sample.images.filter((img) => img.url !== imageUrl) }
        : sample
    )
    updateSampleImages(sampleId, updated.find((s) => s.id === sampleId)?.images || [])
  }

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
                    <div key={i} className="border rounded overflow-hidden">
                      <img src={img.url} alt={img.label} className="w-full h-32 object-cover" />
                      <div className="text-xs p-1 text-muted-foreground flex justify-between items-center">
                        <span>{img.label}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteImage(sample.id, img.url)}
                        >
                          ✖
                        </Button>
                      </div>
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
