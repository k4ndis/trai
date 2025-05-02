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
      <DialogContent className="max-w-5xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sample #{sample.id} – Images</h2>
          <Button variant="default" onClick={onAddNew}>+ Add Image</Button>
        </div>

        {sample.images.length === 0 ? (
          <p className="text-muted-foreground">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sample.images.map((img, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border shadow-sm bg-background"
              >
                <Image
                  src={img.url}
                  alt={img.label}
                  width={300}
                  height={225}
                  className="w-full h-[150px] object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                  {img.label || "(No Label)"}
                </div>

                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-white hover:bg-muted border"
                    onClick={() => onEditImage(index)}
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
