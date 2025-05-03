"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { TABS, TOOLS } from "react-filerobot-image-editor"; // TABS & TOOLS direkt
import { supabase } from "@/lib/supabaseClient";

// Dynamischer Import (nur Client-Seite)
const FilerobotImageEditor = dynamic(
  () => import("react-filerobot-image-editor"),
  { ssr: false }
);

interface Props {
  sampleId: number;
  onUpload: (url: string, label: string) => void;
}

export default function FilerobotUploader({ sampleId, onUpload }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (edited: any) => {
    if (!edited.imageBase64) return;
    setLoading(true);

    const response = await fetch(edited.imageBase64);
    const blob = await response.blob();
    const fileName = `sample-${sampleId}-${Date.now()}.jpg`;

    const { error } = await supabase.storage.from("trai").upload(fileName, blob);
    if (error) {
      console.error("Upload error:", error);
      setLoading(false);
      return;
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/trai/${fileName}`;
    onUpload(publicUrl, label);
    setShowEditor(false);
    setImageSrc(null);
    setLabel("");
    setLoading(false);
  };

  return (
    <Box>
      <Button
        startIcon={<UploadIcon />}
        variant="outlined"
        component="label"
        sx={{ mb: 2 }}
      >
        Select Image
        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
      </Button>

      {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}

      {showEditor && imageSrc && (
        <FilerobotImageEditor
          source={imageSrc}
          onSave={handleUpload}
          onClose={() => setShowEditor(false)}
          annotationsCommon={{ fill: "#ff0000" }}
          Text={{ text: "Kommentar" }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]}
          defaultTabId={TABS.ADJUST}
          defaultToolId={TOOLS.CROP}
          savingPixelRatio={1}
          previewPixelRatio={1}
        />
      )}
    </Box>
  );
}
