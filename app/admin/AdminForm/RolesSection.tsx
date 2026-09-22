"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
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
  move: (from: number, to: number) => void;
  disabled: boolean;
}

export default function RolesSection({
  control,
  errors,
  fields,
  append,
  remove,
  move,
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
          <div
            key={role.id}
            className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-start"
          >
            <div className="w-full lg:col-span-9">
              <Controller
                control={control}
                name={`roles.${index}`}
                render={({ field }) => (
                  <Field label={`Role ${index + 1}`} error={errors.roles?.[index]?.value?.message}>
                    <Input
                      value={field.value.value ?? ""}
                      onChange={(e) => field.onChange({ value: e.target.value })}
                      disabled={disabled}
                    />
                  </Field>
                )}
              />
            </div>

            <div className="flex w-full items-center justify-center gap-2 lg:col-span-3 lg:justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => index > 0 && move(index, index - 1)}
                disabled={disabled || index === 0}
                aria-label={`Move role ${index + 1} up`}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => index < fields.length - 1 && move(index, index + 1)}
                disabled={disabled || index === fields.length - 1}
                aria-label={`Move role ${index + 1} down`}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={disabled}
                aria-label={`Remove role ${index + 1}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}
