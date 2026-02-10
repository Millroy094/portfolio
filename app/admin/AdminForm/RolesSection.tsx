"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import {
  ArrowUpwardSharp,
  ArrowDownwardSharp,
  DeleteSharp
} from "@mui/icons-material";
import { FormSection } from "@/components/FormSection";
import { ProfileSchemaType } from "@/app/admin/schema";

export interface RolesSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  fields: { id: string; value: string }[];
  append: (v: { value: string }) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
}

export default function RolesSection({
  control,
  errors,
  fields,
  append,
  remove,
  move
}: RolesSectionProps) {
  return (
    <FormSection
      title="Roles"
      description="Document specific roles you’ve held (e.g., Team Lead, Reviewer, Maintainer)."
      addLabel="Add role"
      onAdd={() => append({ value: "" })}
      count={fields.length}
    >
      <div className="flex flex-col gap-4">
        {fields.map((role, index) => (
          <div
            key={role.id}
            className="flex flex-col gap-2 lg:grid lg:grid-cols-12 lg:gap-3"
          >
            <div className="w-full lg:col-span-10">
              <Controller
                control={control}
                name={`roles.${index}`}
                render={({ field, fieldState }) => (
                  <TextField
                    label={`Role ${index + 1}`}
                    value={field.value.value ?? ""}
                    onChange={e => field.onChange({ value: e.target.value })}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={errors.roles?.[index]?.value?.message}
                  />
                )}
              />
            </div>

            <div className="flex gap-1 lg:gap-2 lg:col-span-2 lg:justify-end justify-center">
              <IconButton
                onClick={() => index > 0 && move(index, index - 1)}
                disabled={index === 0}
                size="small"
              >
                <ArrowUpwardSharp />
              </IconButton>

              <IconButton
                onClick={() =>
                  index < fields.length - 1 && move(index, index + 1)
                }
                disabled={index === fields.length - 1}
                size="small"
              >
                <ArrowDownwardSharp />
              </IconButton>

              <IconButton onClick={() => remove(index)} size="small">
                <DeleteSharp color="error" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}
