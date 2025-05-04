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
  Typography,
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
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const extractPath = (url: string) => {
    const parts = url.split("/storage/v1/object/public/trai/");
    return parts[1] || "";
  };

  const confirmDelete = async () => {
    if (deleteIndex === null || !sample.images?.[deleteIndex]) return;
    const updatedImages = sample.images.filter((_, i) => i !== deleteIndex);
    const filePath = extractPath(sample.images[deleteIndex].url);
    const { error } = await supabase.storage.from("trai").remove([filePath]);

    if (error) {
      console.error("Supabase deletion failed", error);
    }

    onUpdate({ ...sample, images: updatedImages });
    setDeleteIndex(null);
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
    setEditorSource("");
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
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Images for Sample {sample.id}
            <Tooltip title="Add image">
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
                  <IconButton size="small" onClick={() => setDeleteIndex(i)}>
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
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Delete image?</DialogTitle>
        <DialogContent>
          <Typography>This will permanently delete the image from storage.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
