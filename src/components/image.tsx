// src/components/image.tsx
"use client"

import { useState, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  sampleId: number
  onUpload: (imageUrl: string, label: string) => void
}

export default function ImageUploader({ sampleId, onUpload }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [label, setLabel] = useState("")
  const [uploading, setUploading] = useState(false)

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setUploading(true)

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const fileName = `sample-${sampleId}-${Date.now()}.jpg`

    const uploadResult = await supabase.storage
      .from("trai")
      .upload(fileName, croppedBlob, {
        contentType: "image/jpeg",
        upsert: true,
      })

    if (uploadResult.error) {
      alert("Upload fehlgeschlagen: " + uploadResult.error.message)
      setUploading(false)
      return
    }

    const publicUrl = supabase.storage.from("trai").getPublicUrl(fileName).data.publicUrl
    onUpload(publicUrl, label)
    setImageSrc(null)
    setLabel("")
    setUploading(false)
  }

  return (
    <div className="border p-4 rounded space-y-4 bg-muted">
      <Label className="block">Upload Image</Label>
      <Input type="file" accept="image/*" onChange={onFileChange} />

      {imageSrc && (
        <div className="relative w-full aspect-square bg-black mt-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {imageSrc && (
        <div className="space-y-2">
          <Label>Bildbeschreibung</Label>
          <Textarea
            placeholder="Beschreibung hier..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Hochladen..." : "Upload & Save"}
          </Button>
        </div>
      )}
    </div>
  )
}

// Hilfsfunktion zum Zuschneiden (wie früher in cropImage.ts ausgelagert)
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image()
  image.src = imageSrc
  await new Promise((resolve) => (image.onload = resolve))

  const canvas = document.createElement("canvas")
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext("2d")!

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Canvas blob ist leer.")
      resolve(blob)
    }, "image/jpeg")
  })
}
