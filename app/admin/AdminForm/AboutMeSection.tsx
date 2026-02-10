"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import RichTextEditor from "@/components/controls/RichTextEditor";

export interface AboutMeSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
}

export default function AboutMeSection({
  control,
}: AboutMeSectionProps) {
  return (
    <div className="w-full">
      <Controller
        name="aboutMe"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RichTextEditor
              placeholder="Please write a bit about yourself"
              value={field.value}
              onChange={field.onChange}
            />
            {fieldState.error && (
              <FormHelperText sx={{ pl: 1 }} error>
                {fieldState.error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </div>
  );
}
