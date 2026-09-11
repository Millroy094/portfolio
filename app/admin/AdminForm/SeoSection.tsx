"use client";

import * as React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { FormSection } from "@/components/FormSection";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface SeoSectionProps {
  register: UseFormRegister<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  disabled: boolean;
}

export default function SeoSection({ register, errors, disabled }: SeoSectionProps) {
  return (
    <FormSection
      title="Settings"
      description="Configure SEO and content display options."
      count={1}
      disabled={disabled}
    >
      <div className="mb-1 flex w-full flex-col items-start gap-4">
        <div className="w-full lg:w-1/2">
          <Field label="Website Title" error={errors.seoTitle?.message}>
            <Input {...register("seoTitle")} readOnly={disabled} />
          </Field>
        </div>

        <div className="w-full lg:w-1/2">
          <Field label="SEO Description" error={errors.seoDescription?.message}>
            <Input {...register("seoDescription")} readOnly={disabled} />
          </Field>
        </div>

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
      </div>
    </FormSection>
  );
}
