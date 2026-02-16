"use client";

import { AccountCircle, Person2 } from "@mui/icons-material";
import { Avatar, Button, FormHelperText } from "@mui/material";
import { getUrl } from "aws-amplify/storage";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import * as React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import AvatarCropper from "@/components/controls/AvatorCropper";

export interface AvatarSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  cropOpen: boolean;
  cropFile: File | null;
  setCropOpen: (open: boolean) => void;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
}

/** NEW: Safe component that can use React hooks */
function AvatarDisplay({
  disabled,
  value,
}: {
  value?: File | string | null;
  disabled?: boolean;
}): JSX.Element {
  const [url, setUrl] = useState<string | null>(null);

  const filterClass = disabled ? "grayscale opacity-60" : "";

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
        className={`h-24 w-24 rounded-full border object-cover ${filterClass}`}
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
  errors,
  disabled,
}: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
      <Controller
        name="avatar"
        control={control}
        render={({ field }) => (
          <>
            <AvatarDisplay value={field.value} disabled={disabled} />

            {errors.avatar?.message && (
              <FormHelperText sx={{ pl: 1 }} error>
                {errors.avatar.message}
              </FormHelperText>
            )}

            <Button
              type="button"
              variant="contained"
              color="error"
              startIcon={<AccountCircle />}
              onClick={() => avatarInputRef.current?.click()}
              sx={{ width: "100%", maxWidth: 320 }}
              disabled={disabled}
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
