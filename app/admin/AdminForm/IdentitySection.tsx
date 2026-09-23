"use client";

import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import LinkTextField from "@/components/controls/LinkTextField";
import { FormSection } from "@/components/FormSection";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
    <FormSection
      title="Identity"
      description="Set your name, headline, and social profile links."
      showVisibilityToggle={false}
      showAddButton={false}
      count={1}
      disabled={disabled}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="w-full lg:max-w-xl">
          <Field label="Full Name" error={errors.fullName?.message} required>
            <Input {...register("fullName")} disabled={disabled} />
          </Field>
        </div>

        <div className="w-full lg:w-1/2">
          <Field label="Punch line" error={errors.punchLine?.message} required>
            <Input {...register("punchLine")} disabled={disabled} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-4">
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
    </FormSection>
  );
}
