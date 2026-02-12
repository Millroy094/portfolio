"use client";

import { Paper, Stack, TextField, Typography } from "@mui/material";
import * as React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";

export interface SeoSectionProps {
  register: UseFormRegister<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
}

export default function SeoSection({ register, errors }: SeoSectionProps) {
  return (
    <div className="w-full">
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="column" alignItems="start" sx={{ mb: 1 }} gap={2}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            SEO
          </Typography>
          <div className="w-full ">
            <TextField
              {...register("seoTitle")}
              label="Website Title"
              fullWidth
              error={!!errors.seoTitle}
              helperText={errors.seoTitle?.message ?? ""}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </div>
          <div className="w-full ">
            <TextField
              label="SEO Description"
              fullWidth
              {...register("seoDescription")}
              error={!!errors.seoDescription}
              helperText={errors.seoDescription?.message ?? ""}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </div>
        </Stack>
      </Paper>
    </div>
  );
}
