"use client";

// components/imageeditor.tsx
// MUI + Cropper Editor mit Seitenpanel, Upload & Galerie

import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Fade,
  Typography,
} from "@mui/material";
import {
  RotateLeft,
  RotateRight,
  Flip,
  ZoomIn,
  ZoomOut,
  AddAPhoto,
} from "@mui/icons-material";

type ImageEditorModalProps = {
  open: boolean;
  image: string;
  onClose: () => void;
  onSave: (blob: Blob, label: string) => void;
};

export default function ImageEditorModal({
  open,
  image,
  onClose,
  onSave,
}: ImageEditorModalProps) {
  const cropperRef = useRef<HTMLImageElement & { cropper: Cropper }>(null);
  const [label, setLabel] = useState("");
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const rotate = (deg: number) => cropperRef.current?.cropper?.rotate(deg);
  const zoom = (factor: number) => cropperRef.current?.cropper?.zoom(factor);
  const flipX = () => {
    const newX = scaleX * -1;
    cropperRef.current?.cropper?.scaleX(newX);
    setScaleX(newX);
  };
  const flipY = () => {
    const newY = scaleY * -1;
    cropperRef.current?.cropper?.scaleY(newY);
    setScaleY(newY);
  };

  const handleSave = async () => {
    const canvas = cropperRef.current?.cropper?.getCroppedCanvas();
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve)
    );
    if (blob) {
      onSave(blob, label);
      handleClose();
    }
  };

  const handleClose = () => {
    setLabel("");
    setScaleX(1);
    setScaleY(1);
    setLocalImages([]);
    setSelected("");
    onClose();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        newImages.push(result);
        setLocalImages((prev) => [...prev, result]);
        setSelected(result);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Bild bearbeiten</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          {/* Sidebar: Upload + Thumbnails */}
          <Box sx={{ width: 160, display: "flex", flexDirection: "column", gap: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Button
              variant="outlined"
              startIcon={<AddAPhoto />}
              onClick={() => fileInputRef.current?.click()}
            >
              Bild wählen
            </Button>
            <Box
              sx={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 360,
              }}
            >
              {localImages.map((img, i) => (
                <Fade in={true} key={i}>
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    onClick={() => setSelected(img)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      borderRadius: 4,
                      border: img === selected ? "2px solid #00bcd4" : "1px solid #444",
                    }}
                  />
                </Fade>
              ))}
            </Box>
          </Box>

          {/* Main Editor */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {selected || image ? (
              <Cropper
                src={selected || image}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={1}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                background={false}
              />
            ) : (
              <Typography variant="body2">Kein Bild geladen.</Typography>
            )}

            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <Tooltip title="Links drehen">
                <IconButton onClick={() => rotate(-90)}>
                  <RotateLeft />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rechts drehen">
                <IconButton onClick={() => rotate(90)}>
                  <RotateRight />
                </IconButton>
              </Tooltip>
              <Tooltip title="Horizontal spiegeln">
                <IconButton onClick={flipX}>
                  <Flip />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vertikal spiegeln">
                <IconButton onClick={flipY}>
                  <Flip sx={{ transform: "rotate(90deg)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vergrößern">
                <IconButton onClick={() => zoom(0.1)}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Verkleinern">
                <IconButton onClick={() => zoom(-0.1)}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              label="Bild-Beschriftung"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained">
          Speichern & Hochladen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
