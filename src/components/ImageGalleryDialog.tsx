"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, AddAPhoto } from "@mui/icons-material";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ImageEditorModal from "./imageeditor";

interface ImageEntry {
  url: string;
  label: string;
}

interface Sample {
  id: number;
  images?: ImageEntry[];
}

interface Props {
  open: boolean;
  sample: Sample;
  onClose: () => void;
  onUpdate: (updatedSample: Sample) => void;
}

export default function ImageGalleryDialog({ open, sample, onClose, onUpdate }: Props) {
  const [editImageIndex, setEditImageIndex] = useState<number | null>(null);
  const [editorSource, setEditorSource] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleDelete = (index: number) => {
    const updatedImages = sample.images?.filter((_, i) => i !== index) || [];
    onUpdate({ ...sample, images: updatedImages });
  };

  const handleEdit = (index: number) => {
    const img = sample.images?.[index];
    if (!img) return;
    setEditImageIndex(index);
    setEditorSource(img.url);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditorSource(""); // leeres Bild
    setEditImageIndex(null);
  };

  const handleEditorSave = async (blob: Blob, label: string) => {
    const fileName = `sample-${sample.id}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("trai").upload(fileName, blob);
    if (error) {
      console.error("Upload error", error);
      return;
    }
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/trai/${fileName}`;

    const updatedImages = [...(sample.images || [])];

    if (isAddingNew) {
      updatedImages.push({ url: publicUrl, label });
    } else if (editImageIndex !== null) {
      updatedImages[editImageIndex] = { url: publicUrl, label };
    }

    onUpdate({ ...sample, images: updatedImages });

    setEditImageIndex(null);
    setEditorSource(null);
    setIsAddingNew(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Sample Images {sample.id}
          <Tooltip title="Add Image">
            <IconButton onClick={handleAddNew} color="primary">
              <AddAPhoto />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sample.images?.map((img, i) => (
            <div key={i} className="rounded overflow-hidden relative group border">
              <img
                src={img.url}
                alt={img.label}
                className="w-full h-auto object-cover rounded"
              />
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <IconButton size="small" onClick={() => handleEdit(i)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(i)}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
              <div className="text-sm text-center py-1 px-2 bg-white bg-opacity-80">
                {img.label}
              </div>
            </div>
          ))}
        </div>

        <ImageEditorModal
          open={editorSource !== null}
          image={editorSource || ""}
          onClose={() => {
            setEditImageIndex(null);
            setEditorSource(null);
            setIsAddingNew(false);
          }}
          onSave={handleEditorSave}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}
