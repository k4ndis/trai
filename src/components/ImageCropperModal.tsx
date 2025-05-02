// src/components/ImageCropperModal.tsx
"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Cropper from "react-cropper"
import CropperType from "cropperjs"
import { useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Props {
  sampleId: number
  open: boolean
  image: { url: string; label: string }
  index: number
  onClose: () => void
  onSave: (newUrl: string, newLabel: string, index: number) => void
}

export default function ImageCropperModal({
  sampleId,
  open,
  image,
  index,
  onClose,
  onSave,
}: Props) {
  const cropperRef = useRef<HTMLImageElement>(null)
  const [label, setLabel] = useState(image.label || "")
  const [uploading, setUploading] = useState(false)

  const handleSave = async () => {
    if (!cropperRef.current) return
    setUploading(true)

    const cropper = (cropperRef.current as unknown as { cropper: CropperType }).cropper
    const canvas = cropper.getCroppedCanvas({
      width: 800,
      height: 600,
      fillColor: "#fff",
    })

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"))
    if (!blob) return alert("Crop failed")

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) {
      alert("Not logged in")
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
      alert("Upload failed: " + uploadResult.error.message)
      setUploading(false)
      return
    }

    const publicUrl = supabase.storage.from("trai").getPublicUrl(fileName).data.publicUrl
    onSave(publicUrl, label, index)
    setUploading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl space-y-4">
        <h2 className="text-xl font-semibold">Edit Image</h2>

        <div className="aspect-[4/3] bg-black">
          <Cropper
            src={image.url}
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

        <div>
          <label className="block mb-1 text-sm font-medium">Image Label</label>
          <Textarea
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional description..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={uploading}>
            {uploading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}