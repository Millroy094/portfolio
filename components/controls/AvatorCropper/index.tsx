"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import { Button } from "@/components/ui/button";

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
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const objectUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1200 flex items-center justify-center bg-black/70 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Crop avatar image"
        tabIndex={-1}
        className="w-full max-w-2xl rounded-lg border border-neutral-700 bg-neutral-950 p-4 focus:outline-none"
      >
        <div className="relative h-[300px] overflow-hidden rounded-md">
          {file && (
            <Cropper
              image={objectUrl ?? undefined}
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

        <div className="mt-4">
          <label htmlFor="avatar-zoom" className="sr-only">
            Zoom
          </label>
          <input
            id="avatar-zoom"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-valuetext={`Zoom ${zoom.toFixed(1)}x`}
            className="w-full accent-red-600"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={getCroppedImage}>
            Save Crop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropper;
