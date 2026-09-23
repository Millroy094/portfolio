"use client";

import { Trash2 } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import YearTextField from "@/components/controls/YearTextField";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ExperienceRecord = {
  year: number;
  organization: string;
  title: string;
};

type EducationRecord = {
  year: number;
  institute: string;
  qualification: string;
};

export interface ExperiencesEducationProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  experiences: {
    fields: { id: string }[];
    append: (v: ExperienceRecord) => void;
    remove: (index: number) => void;
  };
  education: {
    fields: { id: string }[];
    append: (v: EducationRecord) => void;
    remove: (index: number) => void;
  };
  disabled: boolean;
}

const currentYear = new Date().getFullYear();

export default function ExperiencesEducationSection({
  control,
  errors,
  experiences,
  education,
  disabled,
}: ExperiencesEducationProps) {
  return (
    <div className="flex flex-col gap-8">
      <FormSection
        title="Experiences"
        description="Add organizations, titles, and the year for each role you’ve held."
        addLabel="Add experience"
        onAdd={() =>
          experiences.append({
            year: currentYear,
            organization: "",
            title: "",
          })
        }
        count={experiences.fields.length}
        disabled={disabled}
        showVisibilityToggle
        visKey="experiences"
        showAddButton
      >
        <div className="flex flex-col gap-4">
          {[...experiences.fields]
            .map((exp, index) => ({ ...exp, index }))
            .sort((a, b) => {
              const ay = control._formValues?.experiences?.[a.index]?.year ?? 0;
              const by = control._formValues?.experiences?.[b.index]?.year ?? 0;
              return by - ay;
            })
            .map((exp) => {
              const index = exp.index;
              return (
                <div
                  key={exp.id}
                  className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-start"
                >
                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`experiences.${index}.organization`}
                      render={({ field }) => (
                        <Field
                          label="Organization"
                          error={errors.experiences?.[index]?.organization?.message}
                          required
                        >
                          <Input
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={disabled}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`experiences.${index}.title`}
                      render={({ field }) => (
                        <Field
                          label="Job Title"
                          error={errors.experiences?.[index]?.title?.message}
                          required
                        >
                          <Input
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={disabled}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <div className="w-full lg:col-span-3">
                    <Controller
                      control={control}
                      name={`experiences.${index}.year`}
                      render={({ field, fieldState }) => (
                        <YearTextField
                          label="Year"
                          value={field.value}
                          onChange={field.onChange}
                          error={!!fieldState.error}
                          errorText={errors.experiences?.[index]?.year?.message}
                          disabled={disabled}
                          required
                        />
                      )}
                    />
                  </div>

                  <div className="flex w-full justify-center gap-2 lg:items-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => experiences.remove(index)}
                      disabled={disabled}
                      className="h-10 w-10"
                      aria-label={`Remove experience ${index + 1}`}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </FormSection>

      <FormSection
        title="Education"
        description="List your education—include institute, qualification, and year."
        addLabel="Add education"
        onAdd={() =>
          education.append({
            year: currentYear,
            institute: "",
            qualification: "",
          })
        }
        count={education.fields.length}
        disabled={disabled}
        showVisibilityToggle
        visKey="education"
        showAddButton
      >
        <div className="flex flex-col gap-4">
          {[...education.fields]
            .map((edu, index) => ({ ...edu, index }))
            .sort((a, b) => {
              const ay = control?._formValues?.education?.[a.index]?.year ?? 0;
              const by = control?._formValues?.education?.[b.index]?.year ?? 0;
              return by - ay;
            })
            .map((edu) => {
              const index = edu.index;
              return (
                <div
                  key={edu.id}
                  className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-start"
                >
                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`education.${index}.institute`}
                      render={({ field }) => (
                        <Field
                          label="Institute"
                          error={errors.education?.[index]?.institute?.message}
                          required
                        >
                          <Input
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={disabled}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`education.${index}.qualification`}
                      render={({ field }) => (
                        <Field
                          label="Qualification"
                          error={errors.education?.[index]?.qualification?.message}
                          required
                        >
                          <Input
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={disabled}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <div className="w-full lg:col-span-3">
                    <Controller
                      control={control}
                      name={`education.${index}.year`}
                      render={({ field, fieldState }) => (
                        <YearTextField
                          label="Year"
                          value={field.value}
                          onChange={field.onChange}
                          error={!!fieldState.error}
                          errorText={errors.education?.[index]?.year?.message}
                          disabled={disabled}
                          required
                        />
                      )}
                    />
                  </div>

                  <div className="flex w-full justify-center gap-2 lg:items-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => education.remove(index)}
                      disabled={disabled}
                      className="h-10 w-10"
                      aria-label={`Remove education ${index + 1}`}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </FormSection>
    </div>
  );
}
