"use client";

import { Control, Controller, FieldErrors, UseFormRegister, useWatch } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import LinkTextField from "@/components/controls/LinkTextField";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface WritingSectionProps {
  register: UseFormRegister<ProfileSchemaType>;
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  disabled: boolean;
}

export default function WritingSection({
  register,
  control,
  errors,
  disabled,
}: WritingSectionProps) {
  const medium = useWatch({ control, name: "medium" });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full lg:w-1/2">
        <Controller
          name="medium"
          control={control}
          render={({ field, fieldState }) => (
            <LinkTextField
              label="Medium"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              disabled={disabled}
            />
          )}
        />
      </div>

      {medium && (
        <div className="w-full lg:w-1/4">
          <Field label="Medium Posts to Display" error={errors.mediumPostCount?.message}>
            <Input
              type="number"
              {...register("mediumPostCount", { valueAsNumber: true })}
              readOnly={disabled}
              min="1"
              max="10"
              inputMode="numeric"
            />
          </Field>
        </div>
      )}
    </div>
  );
}
