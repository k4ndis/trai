// Fully updated Image Editor with full-image crop, correct dimensions, and total reset button
"use client";

import React, { useRef, useState, useEffect } from "react";
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
  Slider,
  InputAdornment,
  Input,
  Select,
  MenuItem,
} from "@mui/material";
import {
  RotateLeft,
  RotateRight,
  Flip,
  ZoomIn,
  ZoomOut,
  AddAPhoto,
  Lock,
  LockOpen,
  RestartAlt,
  CenterFocusStrong,
} from "@mui/icons-material";

const presets = [
  { label: "1:1", ratio: 1 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "A4 Portrait", ratio: 210 / 297 },
  { label: "A4 Landscape", ratio: 297 / 210 },
  { label: "Free", ratio: 0 },
];


type ImageEditorModalProps = {
  open: boolean;
  image: string;
  onClose: () => void;
  onSave: (blob: Blob, label: string) => void;
};

export default function ImageEditorModal({ open, image, onClose, onSave }: ImageEditorModalProps) {
  const cropperRef = useRef<HTMLImageElement & { cropper: Cropper }>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [label, setLabel] = useState("");
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [locked, setLocked] = useState(true);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [presetRatio, setPresetRatio] = useState(1);


  const [localImages, setLocalImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  // Vorschau-Resize live anwenden (nicht ersetzen, sondern nur CropBox setzen)
  useEffect(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !width || !height) return;
    const cropBoxData = cropper.getCropBoxData();
    cropper.setCropBoxData({
      ...cropBoxData,
      width,
      height,
    });
  }, [width, height]);

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

  const handlePresetChange = (value: number) => {
    setPresetRatio(value);
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.setAspectRatio(value);
  };
  
  const centerCropBox = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const container = cropper.getContainerData();
    const cropBox = cropper.getCropBoxData();
    const newLeft = (container.width - cropBox.width) / 2;
    const newTop = (container.height - cropBox.height) / 2;
    cropper.setCropBoxData({ ...cropBox, left: newLeft, top: newTop });
    setCropPos({ x: Math.round(newLeft), y: Math.round(newTop) });
  };  

  const handleSave = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({ width, height });
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
    if (blob) {
      onSave(blob, label);
      handleClose();
    }
  };

  const handleClose = () => {
    setLabel("");
    setScaleX(1);
    setScaleY(1);
    setBrightness(1);
    setContrast(1);
    setLocalImages([]);
    setSelected("");
    onClose();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLocalImages((prev) => [...prev, result]);
        setSelected(result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleResize = (type: "width" | "height", value: number) => {
    const val = isNaN(value) || value < 10 ? 10 : value;
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
  
    const cropBox = cropper.getCropBoxData();

    const newBox = cropper.getCropBoxData();
    setCropPos({ x: Math.round(newBox.left), y: Math.round(newBox.top) });
  
    if (type === "width") {
      const newHeight = locked ? Math.round(val * (originalSize.height / originalSize.width)) : height;
      cropper.setCropBoxData({ ...cropBox, width: val, height: newHeight });
      setWidth(val);
      setHeight(newHeight);
    } else {
      const newWidth = locked ? Math.round(val * (originalSize.width / originalSize.height)) : width;
      cropper.setCropBoxData({ ...cropBox, width: newWidth, height: val });
      setHeight(val);
      setWidth(newWidth);
    }
  };  

  const resetAll = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.reset();
    cropper.setDragMode("move");
    const containerData = cropper.getContainerData();
    cropper.setCropBoxData({
      left: 0,
      top: 0,
      width: containerData.width,
      height: containerData.height,
    });
    setScaleX(1);
    setScaleY(1);
    setBrightness(1);
    setContrast(1);
    setWidth(originalSize.width);
    setHeight(originalSize.height);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Image</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          {/* Sidebar */}
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
              Choose image
            </Button>
            <Box sx={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, maxHeight: 360 }}>
              {localImages.map((img, i) => (
                <Fade in={true} key={i}>
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    onClick={() => setSelected(img)}
                    style={{ cursor: "pointer", width: "100%", borderRadius: 4, border: img === selected ? "2px solid #00bcd4" : "1px solid #444" }}
                  />
                </Fade>
              ))}
            </Box>
          </Box>

          {/* Editor */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {selected || image ? (
              <Cropper
                src={selected || image}
                style={{ height: 400, width: "100%", filter: `brightness(${brightness}) contrast(${contrast})` }}
                initialAspectRatio={1}
                viewMode={1}
                autoCropArea={1}
                ready={() => {
                  const cropper = cropperRef.current?.cropper;
                  if (!cropper) return;
                
                  cropper.clear();               // CropBox zurücksetzen
                  cropper.setDragMode("move");   // Beweglich machen
                  cropper.enable();              // Sicherheitsmaßnahme in neueren Versionen
                
                  const canvasData = cropper.getCanvasData();
                
                  cropper.setCropBoxData({
                    left: canvasData.left,
                    top: canvasData.top,
                    width: canvasData.width,
                    height: canvasData.height,
                  });

                  cropper.crop();

                  setCropPos({ x: canvasData.left, y: canvasData.top });                
                  setOriginalSize({ width: canvasData.width, height: canvasData.height });
                  setWidth(canvasData.width);
                  setHeight(canvasData.height);
                }}                
                ref={cropperRef}
                guides={true}
                background={false}
              />
            ) : (
              <Typography variant="body2">No image loaded.</Typography>
            )}

            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <Tooltip title="Rotate left"><IconButton onClick={() => rotate(-90)}><RotateLeft /></IconButton></Tooltip>
              <Tooltip title="Rotate right"><IconButton onClick={() => rotate(90)}><RotateRight /></IconButton></Tooltip>
              <Tooltip title="Flip horizontally"><IconButton onClick={flipX}><Flip /></IconButton></Tooltip>
              <Tooltip title="Flip vertically"><IconButton onClick={flipY}><Flip sx={{ transform: "rotate(90deg)" }} /></IconButton></Tooltip>
              <Tooltip title="Zoom in"><IconButton onClick={() => zoom(0.1)}><ZoomIn /></IconButton></Tooltip>
              <Tooltip title="Zoom out"><IconButton onClick={() => zoom(-0.1)}><ZoomOut /></IconButton></Tooltip>
              <Tooltip title="Center crop box">
                <IconButton onClick={centerCropBox}><CenterFocusStrong /></IconButton>
              </Tooltip>
              <Tooltip title="Reset all">
                <IconButton onClick={resetAll}><RestartAlt /></IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
              <Typography variant="body2">Crop Preset:</Typography>
              <Select size="small" value={presetRatio} onChange={(e) => handlePresetChange(Number(e.target.value))}>
                {presets.map((p) => (
                  <MenuItem key={p.label} value={p.ratio}>{p.label}</MenuItem>
                ))}
              </Select>
              <Typography variant="body2" sx={{ ml: "auto" }}>
                X: {cropPos.x}px &nbsp; Y: {cropPos.y}px &nbsp; W: {width}px &nbsp; H: {height}px
              </Typography>
            </Box>
            <Typography variant="subtitle2">Finetune</Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body2">Brightness</Typography>
              <Slider value={brightness} onChange={(_, v) => setBrightness(v as number)} min={0.5} max={1.5} step={0.01} sx={{ flex: 1 }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body2">Contrast</Typography>
              <Slider value={contrast} onChange={(_, v) => setContrast(v as number)} min={0.5} max={1.5} step={0.01} sx={{ flex: 1 }} />
            </Box>

            <Typography variant="subtitle2">Resize</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Input
                value={width}
                onChange={(e) => handleResize("width", parseFloat(e.target.value))}
                endAdornment={<InputAdornment position="end">px</InputAdornment>}
                type="number"
              />
              <IconButton onClick={() => setLocked(!locked)}>{locked ? <Lock /> : <LockOpen />}</IconButton>
              <Input
                value={height}
                onChange={(e) => handleResize("height", parseFloat(e.target.value))}
                endAdornment={<InputAdornment position="end">px</InputAdornment>}
                type="number"
              />
            </Box>

            <TextField
              fullWidth
              label="Image label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save & Upload</Button>
      </DialogActions>
    </Dialog>
  );
}
