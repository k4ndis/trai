// src/components/ImageGalleryModal.tsx
"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sample } from "@/lib/store"
import { X, Pencil } from "lucide-react"
import Image from "next/image"

interface Props {
  sample: Sample
  open: boolean
  onClose: () => void
  onEditImage: (imageIndex: number) => void
  onDeleteImage: (imageIndex: number) => void
  onAddNew?: () => void
}

export default function ImageGalleryModal({
  sample,
  open,
  onClose,
  onEditImage,
  onDeleteImage,
  onAddNew,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Images for Sample #{sample.id}</h2>
          <Button variant="secondary" onClick={onAddNew}>+ Add Image</Button>
        </div>

        {sample.images.length === 0 ? (
          <p className="text-muted-foreground">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sample.images.map((img, index) => (
              <div key={index} className="relative group rounded overflow-hidden border shadow-sm">
                <Image
                  src={img.url}
                  alt={img.label}
                  width={300}
                  height={225}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-1 truncate">
                  {img.label || "(No Label)"}
                </div>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => onEditImage(index)}
                    className="bg-white hover:bg-muted border"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onDeleteImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
