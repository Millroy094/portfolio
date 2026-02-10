"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import { DeleteSharp } from "@mui/icons-material";
import { FormSection } from "@/components/FormSection";
import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";

export interface RolesSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  fields: { id: string; value: string }[];
  append: (v: { value: string }) => void;
  remove: (index: number) => void;
}

export default function RolesSection({
  control,
  errors,
  fields,
  append,
  remove
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
            className="flex gap-2 lg:grid lg:grid-cols-12 lg:gap-3"
          >
            <div className="w-full lg:col-span-11">
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
                    variant="outlined"
                    slotProps={{
                      inputLabel: { shrink: !!field.value?.value }
                    }}
                  />
                )}
              />
            </div>

            {/* Remove button only */}
            <div className="flex gap-2 justify-center">
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
