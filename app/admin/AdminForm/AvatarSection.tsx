"use client";

import { getUrl } from "aws-amplify/storage";
import { Upload, UserRound } from "lucide-react";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import * as React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import AvatarCropper from "@/components/controls/AvatorCropper";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";

export interface AvatarSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  cropOpen: boolean;
  cropFile: File | null;
  setCropOpen: (open: boolean) => void;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
}

function AvatarDisplay({ value }: { value?: File | string | null }): JSX.Element {
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
    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900">
      <UserRound className="h-10 w-10 text-neutral-400" />
    </div>
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
    <FormSection
      title="Avatar"
      description="Upload and crop your profile image shown on the home page."
      showVisibilityToggle={false}
      showAddButton={false}
      count={1}
      disabled={disabled}
    >
      <div className="flex w-full flex-col items-center gap-3 sm:gap-4">
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <>
              <AvatarDisplay value={field.value} />

              {errors.avatar?.message && (
                <p className="pl-1 text-sm text-red-400">{errors.avatar.message}</p>
              )}

              <Button
                type="button"
                variant="destructive"
                onClick={() => avatarInputRef.current?.click()}
                className="w-full max-w-80"
                disabled={disabled}
              >
                <Upload className="h-4 w-4" />
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
    </FormSection>
  );
}
