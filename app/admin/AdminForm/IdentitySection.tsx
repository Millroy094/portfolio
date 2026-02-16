"use client";

import { TextField } from "@mui/material";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import LinkTextField from "@/components/controls/LinkTextField";

export interface IdentitySectionProps {
  register: UseFormRegister<ProfileSchemaType>;
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  disabled: boolean;
}

export default function IdentitySection({
  register,
  control,
  errors,
  disabled,
}: IdentitySectionProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Full Name */}
      <div className="w-full lg:max-w-xl">
        <TextField
          {...register("fullName")}
          label="Full Name"
          fullWidth
          error={!!errors.fullName}
          helperText={errors.fullName?.message ?? ""}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: { readOnly: disabled },
          }}
        />
      </div>

      {/* Punch line */}
      <div className="w-full lg:w-1/2">
        <TextField
          label="Punch line"
          fullWidth
          {...register("punchLine")}
          error={!!errors.punchLine}
          helperText={errors.punchLine?.message ?? ""}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: { readOnly: disabled },
          }}
        />
      </div>

      {/* Links (LinkedIn, Github, StackOverflow) */}
      <div
        className="
          grid grid-cols-1 gap-4
          md:grid-cols-1
          lg:grid-cols-3
      "
      >
        <Controller
          name="linkedIn"
          control={control}
          render={({ field, fieldState }) => (
            <LinkTextField
              label="LinkedIn"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              disabled={disabled}
            />
          )}
        />

        <Controller
          name="github"
          control={control}
          render={({ field, fieldState }) => (
            <LinkTextField
              label="GitHub"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              disabled={disabled}
            />
          )}
        />

        <Controller
          name="stackOverflow"
          control={control}
          render={({ field, fieldState }) => (
            <LinkTextField
              label="Stack Overflow"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              disabled={disabled}
            />
          )}
        />
      </div>

      {/* Resume */}
      <div className="w-full lg:w-1/2">
        <Controller
          name="resume"
          control={control}
          render={({ field, fieldState }) => (
            <LinkTextField
              label="Resume"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              disabled={disabled}
            />
          )}
        />
      </div>
    </div>
  );
}
