"use client";

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
            <Input {...register("seoTitle")} disabled={disabled} />
          </Field>
        </div>

        <div className="w-full lg:w-1/2">
          <Field label="SEO Description" error={errors.seoDescription?.message}>
            <Input {...register("seoDescription")} disabled={disabled} />
          </Field>
        </div>
      </div>
    </FormSection>
  );
}
