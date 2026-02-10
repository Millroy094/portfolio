"use client";

import Image from "next/image";
import { Controller, Control } from "react-hook-form";
import { Avatar, Button } from "@mui/material";
import { AccountCircle, Person2 } from "@mui/icons-material";
import AvatarCropper from "@/components/controls/AvatorCropper";
import { ProfileSchemaType } from "@/app/admin/schema";

export interface AvatarSectionProps {
  control: Control<ProfileSchemaType>;
  cropOpen: boolean;
  cropFile: File | null;
  setCropOpen: (open: boolean) => void;
  avatarInputRef: React.RefObject<HTMLInputElement|null>;
}

export default function AvatarSection({
  control,
  cropOpen,
  cropFile,
  setCropOpen,
  avatarInputRef
}: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
      <Controller
        name="avatar"
        control={control}
        render={({ field }) => (
          <>
            {field.value instanceof File ? (
              <Image
                alt="profile picture"
                width={100}
                height={100}
                src={URL.createObjectURL(field.value)}
                className="h-24 w-24 rounded-full border object-cover"
              />
            ) : (
              <Avatar sx={{ width: "100px", height: "100px" }}>
                <Person2 fontSize="large" />
              </Avatar>
            )}

            <Button
              type="button"
              variant="contained"
              color="error"
              startIcon={<AccountCircle />}
              onClick={() => avatarInputRef.current?.click()}
              sx={{ width: "100%", maxWidth: 320 }}
            >
              Choose Avatar
            </Button>

            <AvatarCropper
              open={cropOpen}
              file={cropFile}
              onClose={() => setCropOpen(false)}
              onCropped={(croppedFile: File) => field.onChange(croppedFile)}
            />
          </>
        )}
      />
    </div>
  );
}
