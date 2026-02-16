"use client";

import { FormHelperText } from "@mui/material";
import * as React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import RichTextEditor from "@/components/controls/RichTextEditor";
import { FormSection } from "@/components/FormSection";

export interface AboutMeSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  disabled: boolean;
}

export default function AboutMeSection({ control, disabled }: AboutMeSectionProps) {
  return (
    <FormSection
      title="About Me"
      description="Tell visitors a bit about who you are."
      visKey="aboutMe"
      showVisibilityToggle
      showAddButton={false}
      count={1}
      disabled={disabled}
    >
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
    </FormSection>
  );
}
