"use client";

import { Slider, Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import createCroppedImage from "./createCropperImage";

type AvatorCropperProps = {
  file?: File | null;
  open: boolean;
  onClose: () => void;
  onCropped: (file: File) => void;
};

const AvatarCropper: FC<AvatorCropperProps> = ({ file, open, onClose, onCropped }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const objectUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels);
  };

  const getCroppedImage = async () => {
    if (!file || !croppedArea || !objectUrl) return;

    try {
      const imageFile = await createCroppedImage(objectUrl, croppedArea, {
        circular: true,
        output: "png",
        quality: 0.92,
      });
      onCropped(imageFile);
      onClose();
    } catch (e) {
      console.error("Cropping failed", e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <div className="relative h-[300px]">
          {file && (
            <Cropper
              image={URL.createObjectURL(file)}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, val) => setZoom(val)} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={getCroppedImage}>
          Save Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarCropper;
