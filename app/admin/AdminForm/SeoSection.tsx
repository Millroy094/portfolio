"use client";

import { Stack, TextField } from "@mui/material";
import * as React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { FormSection } from "@/components/FormSection";

export interface SeoSectionProps {
  register: UseFormRegister<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  disabled: boolean;
}

export default function SeoSection({ register, errors, disabled }: SeoSectionProps) {
  return (
    <FormSection
      title="SEO"
      description="Control the title and description used for search engines."
      count={1}
      disabled={disabled}
    >
      <Stack direction="column" alignItems="start" gap={2} sx={{ mb: 1, width: "100%" }}>
        <div className="w-full">
          <TextField
            {...register("seoTitle")}
            label="Website Title"
            fullWidth
            error={!!errors.seoTitle}
            helperText={errors.seoTitle?.message ?? ""}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { readOnly: disabled },
            }}
          />
        </div>

        <div className="w-full">
          <TextField
            label="SEO Description"
            fullWidth
            {...register("seoDescription")}
            error={!!errors.seoDescription}
            helperText={errors.seoDescription?.message ?? ""}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { readOnly: disabled },
            }}
          />
        </div>
      </Stack>
    </FormSection>
  );
}
