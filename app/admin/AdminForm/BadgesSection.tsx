"use client";

import Image from "next/image";
import { FieldErrors } from "react-hook-form";
import { IconButton } from "@mui/material";
import { DeleteSharp } from "@mui/icons-material";
import { FormSection } from "@/components/FormSection";
import { ProfileSchemaType } from "@/app/admin/schema";

export interface BadgesSectionProps {
  errors: FieldErrors<ProfileSchemaType>;
  fields: { id: string; value: string | File }[];
  append: (v: { value: File }) => void;
  remove: (index: number) => void;
  badgeFileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function BadgesSection({
  fields,
  append,
  remove,
  badgeFileInputRef
}: BadgesSectionProps) {
  return (
    <FormSection
      title="Badges"
      description="Add badges or certifications. Use a URL badge image or upload a file."
      addLabel="Add badge"
      onAdd={() => badgeFileInputRef.current?.click()}
      count={fields.length}
    >
      <input
        type="file"
        ref={badgeFileInputRef}
        hidden
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) append({ value: file });
          if (badgeFileInputRef.current) badgeFileInputRef.current.value = "";
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {fields.map((badge, index) => {
          const val = badge.value;
          const isUrl = typeof val === "string";
          const isFile = val instanceof File;

          return (
            <div
              key={badge.id}
              className="relative rounded border bg-white/70 dark:bg-white/10"
              style={{ minHeight: 150, maxHeight: 150 }}
            >
              <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5),linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5)] bg-[size:16px_16px] bg-[position:0_0,8px_8px]" />

              {isUrl && (
                <Image
                  alt="Badge"
                  src={val}
                  fill
                  className="object-contain p-3"
                />
              )}

              {isFile && (
                <Image
                  alt="Badge"
                  src={URL.createObjectURL(val)}
                  fill
                  className="object-contain p-3"
                  unoptimized
                />
              )}

              <div className="absolute top-1 right-1">
                <IconButton
                  onClick={() => remove(index)}
                  size="small"
                  className="bg-white/80 hover:bg-white"
                >
                  <DeleteSharp color="error" fontSize="small" />
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>
    </FormSection>
  );
}
