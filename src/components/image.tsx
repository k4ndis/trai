// src/components/image.tsx
"use client"

import { useRef, useState } from "react"
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css"
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

    const cropper = (cropperRef.current as any)?.cropper
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
        metadata: {
          owner: userId,
        },
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
        <div className="relative w-full max-w-md aspect-[4/3] bg-black mt-4 mx-auto">
          <Cropper
            src={imageSrc}
            style={{ height: 300, width: "100%" }}
            aspectRatio={4 / 3}
            guides={false}
            ref={cropperRef}
            viewMode={1}
            background={false}
            responsive={true}
            checkOrientation={false}
          />
        </div>
      )}

      {imageSrc && (
        <div className="space-y-2">
          <Label>Comment</Label>
          <Textarea
            placeholder="Comment"
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
