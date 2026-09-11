"use client";

import { Trash2 } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
      showVisibilityToggle
      visKey="roles"
      showAddButton
    >
      <div className="flex flex-col gap-4">
        {fields.map((role, index) => (
          <div key={role.id} className="flex gap-2 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-end">
            <div className="w-full lg:col-span-11">
              <Controller
                control={control}
                name={`roles.${index}`}
                render={({ field }) => (
                  <Field label={`Role ${index + 1}`} error={errors.roles?.[index]?.value?.message}>
                    <Input
                      value={field.value.value ?? ""}
                      onChange={(e) => field.onChange({ value: e.target.value })}
                      readOnly={disabled}
                    />
                  </Field>
                )}
              />
            </div>

            <div className="flex justify-center gap-2 lg:pb-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={disabled}
                className="h-10 w-10"
                aria-label={`Remove role ${index + 1}`}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}
