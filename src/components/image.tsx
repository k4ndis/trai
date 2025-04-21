// src/components/image.tsx
"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/lib/cropImage"
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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
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

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setUploading(true)

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const fileName = `sample-${sampleId}-${Date.now()}.jpg`

    const { data, error } = await supabase.storage
      .from("trai")
      .upload(fileName, croppedBlob, {
        contentType: "image/jpeg",
        upsert: true,
      })

    if (error) {
      alert("Upload fehlgeschlagen: " + error.message)
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
