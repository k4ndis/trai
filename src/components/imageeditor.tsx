// components/imageeditor.tsx
// MUI + Cropper-basierter Image Editor im Modal (TypeScript)

import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
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
} from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FlipIcon from '@mui/icons-material/Flip';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

// Props-Typen definieren
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
  const [label, setLabel] = useState('');
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const rotate = (deg: number) => {
    cropperRef.current?.cropper?.rotate(deg);
  };

  const zoom = (factor: number) => {
    cropperRef.current?.cropper?.zoom(factor);
  };

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
    setLabel('');
    setScaleX(1);
    setScaleY(1);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Bild bearbeiten</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={1}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            background={false}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Tooltip title="Links drehen">
              <IconButton onClick={() => rotate(-90)}>
                <RotateLeftIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rechts drehen">
              <IconButton onClick={() => rotate(90)}>
                <RotateRightIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Horizontal spiegeln">
              <IconButton onClick={flipX}>
                <FlipIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vertikal spiegeln">
              <IconButton onClick={flipY}>
                <FlipIcon style={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vergrößern">
              <IconButton onClick={() => zoom(0.1)}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Verkleinern">
              <IconButton onClick={() => zoom(-0.1)}>
                <ZoomOutIcon />
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
