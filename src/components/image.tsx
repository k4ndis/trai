// src/components/image.tsx
"use client"

import { useRef, useState } from "react"
import Cropper from "react-cropper"
import CropperType from "cropperjs"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import "@/styles/cropper.css"

interface Props {
  sampleId: number
  onUpload: (imageUrl: string, label: string) => void
}

export default function ImageUploader({ sampleId, onUpload }: Props) {
  const cropperRef = useRef<HTMLImageElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [label, setLabel] = useState("")
  const [uploading, setUploading] = useState(false)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!cropperRef.current || !imageSrc) return
    setUploading(true)

    const cropper = (cropperRef.current as unknown as { cropper: CropperType }).cropper
    const canvas = cropper.getCroppedCanvas({
      width: 800,
      height: 600,
      fillColor: "#fff",
    })

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    )
    if (!blob) {
      alert("Zuschneiden fehlgeschlagen.")
      setUploading(false)
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) {
      alert("Kein Benutzer eingeloggt.")
      setUploading(false)
      return
    }

    const fileName = `sample-${sampleId}-${Date.now()}.jpg`
    const uploadResult = await supabase.storage
      .from("trai")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: true,
        metadata: { owner: userId },
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

  const handleZoom = (factor: number) => {
    const cropper = (cropperRef.current as any)?.cropper
    cropper?.zoom(factor)
  }

  const handleRotate = () => {
    const cropper = (cropperRef.current as any)?.cropper
    cropper?.rotate(90)
  }

  const handleReset = () => {
    const cropper = (cropperRef.current as any)?.cropper
    cropper?.reset()
  }

  return (
    <div className="space-y-4 p-6 bg-background rounded-xl border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="file">Select Image</Label>
        <Input id="file" type="file" accept="image/*" onChange={onFileChange} />
      </div>

      {imageSrc && (
        <div className="space-y-4">
          <div className="aspect-[4/3] w-full max-w-2xl mx-auto">
            <Cropper
              src={imageSrc}
              style={{ height: 400, width: "100%" }}
              aspectRatio={4 / 3}
              guides={true}
              ref={cropperRef}
              viewMode={1}
              background={false}
              responsive={true}
              checkOrientation={false}
            />
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            <Button size="icon" variant="secondary" onClick={() => handleZoom(0.1)}><ZoomIn className="w-4 h-4" /></Button>
            <Button size="icon" variant="secondary" onClick={() => handleZoom(-0.1)}><ZoomOut className="w-4 h-4" /></Button>
            <Button size="icon" variant="secondary" onClick={handleRotate}><RotateCcw className="w-4 h-4" /></Button>
            <Button size="icon" variant="secondary" onClick={handleReset}><Maximize2 className="w-4 h-4" /></Button>
          </div>

          <div className="space-y-2">
            <Label>Label / Comment</Label>
            <Textarea
              placeholder="Kommentar zum Bild (optional)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Hochladen..." : "Upload & Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}