"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import dynamic from "next/dynamic";
import FilerobotUploader from "./FilerobotUploader";
import { supabase } from "@/lib/supabaseClient";
import ClientOnlyEditor from "./ClientOnlyEditor";


const FilerobotImageEditor = dynamic(
  () => import("react-filerobot-image-editor"),
  { ssr: false }
);

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
  const [editingLabel, setEditingLabel] = useState<string>("");

  const handleDelete = (index: number) => {
    const updatedImages = sample.images?.filter((_, i) => i !== index) || [];
    onUpdate({ ...sample, images: updatedImages });
  };

  const handleEdit = (index: number) => {
    const img = sample.images?.[index];
    if (!img) return;
    setEditImageIndex(index);
    setEditorSource(img.url);
    setEditingLabel(img.label);
  };

  const handleEditorSave = async (imageBase64: string) => {
    if (!imageBase64 || editImageIndex === null) return;
  
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    const fileName = `sample-${sample.id}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("trai").upload(fileName, blob);
    if (error) return console.error("Upload error", error);
  
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/trai/${fileName}`;
    const updatedImages = [...(sample.images || [])];
    updatedImages[editImageIndex] = { url: publicUrl, label: editingLabel };
    onUpdate({ ...sample, images: updatedImages });
  
    setEditImageIndex(null);
    setEditorSource(null);
    setEditingLabel("");
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Bilder für Sample {sample.id}</DialogTitle>
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

        <div className="mt-6">
          <Typography variant="subtitle1" gutterBottom>
            Neues Bild hochladen
          </Typography>
          <FilerobotUploader
            sampleId={sample.id}
            onUpload={(url, label) => {
              const updated = [...(sample.images || []), { url, label }];
              onUpdate({ ...sample, images: updated });
            }}
          />
        </div>

        {editorSource && (
          <ClientOnlyEditor
            source={editorSource}
            label={editingLabel}
            onSave={handleEditorSave}
            onClose={() => {
              setEditImageIndex(null);
              setEditorSource(null);
              setEditingLabel("");
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}
