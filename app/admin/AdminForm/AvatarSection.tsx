"use client";

import { AccountCircle, Person2 } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import { getUrl } from "aws-amplify/storage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import AvatarCropper from "@/components/controls/AvatorCropper";

export interface AvatarSectionProps {
  control: Control<ProfileSchemaType>;
  cropOpen: boolean;
  cropFile: File | null;
  setCropOpen: (open: boolean) => void;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
}

/** NEW: Safe component that can use React hooks */
function AvatarDisplay({ value }: { value?: File | string | null }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (value instanceof File) {
        setUrl(URL.createObjectURL(value));
      } else if (typeof value === "string" && value.length > 0) {
        const { url } = await getUrl({ path: value });
        setUrl(url.toString());
      } else {
        setUrl(null);
      }
    }
    load();
  }, [value]);

  if (url) {
    return (
      <Image
        alt="avatar"
        width={100}
        height={100}
        src={url}
        className="h-24 w-24 rounded-full border object-cover"
      />
    );
  }

  return (
    <Avatar sx={{ width: "100px", height: "100px" }}>
      <Person2 fontSize="large" />
    </Avatar>
  );
}

export default function AvatarSection({
  control,
  cropOpen,
  cropFile,
  setCropOpen,
  avatarInputRef,
}: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
      <Controller
        name="avatar"
        control={control}
        render={({ field }) => (
          <>
            {/* SAFE: AvatarDisplay uses hooks internally */}
            <AvatarDisplay value={field.value} />

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
