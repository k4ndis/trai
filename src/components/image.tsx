// src/components/image.tsx
"use client"

import { useState } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { getCroppedImg } from "@/lib/cropImage"
import { v4 as uuidv4 } from "uuid"
import Modal from "react-modal"

interface SampleImageUploaderProps {
  sampleId: number
  onUpload: (url: string, caption: string) => void
}

export function SampleImageUploader({ sampleId, onUpload }: SampleImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [caption, setCaption] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setIsCropping(true)
    }
  }

  const handleCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }

  const uploadImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const fileName = `sample-${sampleId}-${uuidv4()}.png`

    const { data, error } = await supabase.storage
      .from("trai")
      .upload(fileName, croppedBlob, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/png",
      })

    if (error) return alert("Upload failed: " + error.message)

    const url = supabase.storage.from("trai").getPublicUrl(fileName).data.publicUrl
    onUpload(url, caption)
    setIsCropping(false)
    setImageSrc(null)
    setCaption("")
  }

  return (
    <div className="space-y-2">
      <Label>Upload Image</Label>
      <Input type="file" accept="image/*" onChange={handleFileChange} />

      <Modal isOpen={isCropping} onRequestClose={() => setIsCropping(false)} ariaHideApp={false}>
        {imageSrc && (
          <div className="relative w-full h-[400px] bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
        )}
        <div className="mt-4 space-y-2">
          <Label>Caption</Label>
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
          <Button onClick={uploadImage}>Upload</Button>
        </div>
      </Modal>
    </div>
  )
}
