"use client";

import { Trash2 } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface BadgesSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  fields: { id: string; value: string | File }[];
  remove: (index: number) => void;
  badgeFileInputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
}

export default function BadgesSection({
  control,
  errors,
  fields,
  remove,
  badgeFileInputRef,
  disabled,
}: BadgesSectionProps) {
  return (
    <FormSection
      title="Badges"
      description="Add badges or certifications. Use a URL badge image or upload a file."
      addLabel="Add badge"
      onAdd={() => badgeFileInputRef.current?.click()}
      count={fields.length}
      disabled={disabled}
      visKey="badges"
      showVisibilityToggle
      showAddButton
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {fields.map((badge, index) => (
          <div key={badge.id} className="flex flex-col gap-4">
            <div
              className="relative rounded border-2 border-gray-300 bg-white/70 dark:bg-white/20"
              style={{ minHeight: 150, maxHeight: 150 }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5),linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5)] bg-size-[16px_16px] bg-position-[0_0,8px_8px] opacity-30" />

              <BadgeDisplay value={badge.value} />

              <div className="absolute right-1 top-1">
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                  disabled={disabled}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </div>
            <Controller
              control={control}
              name={`badges.${index}.label`}
              render={({ field }) => (
                <Field label="Badge Label" error={errors.badges?.[index]?.label?.message}>
                  <Input
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={disabled}
                  />
                </Field>
              )}
            />
          </div>
        ))}
      </div>
    </FormSection>
  );
}
