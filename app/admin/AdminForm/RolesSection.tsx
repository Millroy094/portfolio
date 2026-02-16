"use client";

import { DeleteSharp } from "@mui/icons-material";
import { TextField, IconButton } from "@mui/material";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { FormSection } from "@/components/FormSection";

export interface RolesSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  fields: { id: string; value: string }[];
  append: (v: { value: string }) => void;
  remove: (index: number) => void;
  disabled: boolean;
}

export default function RolesSection({
  control,
  errors,
  fields,
  append,
  remove,
  disabled,
}: RolesSectionProps) {
  return (
    <FormSection
      title="Roles"
      description="Document specific roles you’ve held (e.g., Team Lead, Reviewer, Maintainer)."
      addLabel="Add role"
      onAdd={() => append({ value: "" })}
      count={fields.length}
      disabled={disabled}
    >
      <div className="flex flex-col gap-4">
        {fields.map((role, index) => (
          <div key={role.id} className="flex gap-2 lg:grid lg:grid-cols-12 lg:gap-3">
            <div className="w-full lg:col-span-11">
              <Controller
                control={control}
                name={`roles.${index}`}
                render={({ field, fieldState }) => (
                  <TextField
                    label={`Role ${index + 1}`}
                    value={field.value.value ?? ""}
                    onChange={(e) => field.onChange({ value: e.target.value })}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={errors.roles?.[index]?.value?.message}
                    variant="outlined"
                    slotProps={{
                      inputLabel: { shrink: !!field.value?.value },
                      htmlInput: { readOnly: disabled },
                    }}
                  />
                )}
              />
            </div>

            {/* Remove button only */}
            <div className="flex gap-2 justify-center">
              <IconButton onClick={() => remove(index)} size="small" disabled={disabled}>
                <DeleteSharp color={disabled ? "disabled" : "error"} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}
