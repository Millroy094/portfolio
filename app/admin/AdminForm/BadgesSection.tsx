"use client";

import { DeleteSharp } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { BadgeDisplay } from "@/components/BadgeDisplay"; // ★ NEW
import { FormSection } from "@/components/FormSection";

export interface BadgesSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  fields: { id: string; value: string | File }[];
  remove: (index: number) => void;
  badgeFileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function BadgesSection({
  control,
  errors,
  fields,
  remove,
  badgeFileInputRef,
}: BadgesSectionProps) {
  return (
    <>
      <FormSection
        title="Badges"
        description="Add badges or certifications. Use a URL badge image or upload a file."
        addLabel="Add badge"
        onAdd={() => badgeFileInputRef.current?.click()}
        count={fields.length}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {fields.map((badge, index) => (
            <div key={badge.id} className="flex flex-col gap-4">
              <div
                className="relative rounded border-2 border-gray-300 bg-white/70 dark:bg-white/20"
                style={{ minHeight: 150, maxHeight: 150 }}
              >
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5),linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5)] bg-size-[16px_16px] bg-position-[0_0,8px_8px]" />

                {/* Hook-safe Badge display */}
                <BadgeDisplay value={badge.value} />

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
              <Controller
                control={control}
                name={`badges.${index}.label`}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Badge Label"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={errors.badges?.[index]?.label?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: { shrink: !!field.value },
                    }}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </FormSection>
    </>
  );
}
