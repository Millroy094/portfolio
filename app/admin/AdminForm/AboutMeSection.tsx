"use client";

import { FormHelperText, Paper, Stack, Typography } from "@mui/material";
import * as React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import RichTextEditor from "@/components/controls/RichTextEditor";

export interface AboutMeSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  disabled: boolean;
}

export default function AboutMeSection({ control, disabled }: AboutMeSectionProps) {
  return (
    <div className="w-full">
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="column" alignItems="start" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            About me
          </Typography>
          <Controller
            name="aboutMe"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <RichTextEditor
                  placeholder="Please write a bit about yourself"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
                {fieldState.error && (
                  <FormHelperText sx={{ pl: 1 }} error>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </Stack>
      </Paper>
    </div>
  );
}
