"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import { DeleteSharp } from "@mui/icons-material";
import { FormSection } from "@/components/FormSection";
import YearTextField from "@/components/controls/YearTextField";
import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";

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
}

const currentYear = new Date().getFullYear();

export default function ExperiencesEducationSection({
  control,
  errors,
  experiences,
  education,
}: ExperiencesEducationProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Experiences */}
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
                  className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3"
                >
                  {/* Organization */}
                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`experiences.${index}.organization`}
                      render={({ field, fieldState }) => (
                        <TextField
                          label="Organization"
                          fullWidth
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!fieldState.error}
                          helperText={
                            errors.experiences?.[index]?.organization?.message
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Title */}
                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`experiences.${index}.title`}
                      render={({ field, fieldState }) => (
                        <TextField
                          label="Job Title"
                          fullWidth
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!fieldState.error}
                          helperText={
                            errors.experiences?.[index]?.title?.message
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Year */}
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
                        />
                      )}
                    />
                  </div>

                  {/* Remove button only */}
                  <div className="flex gap-2 justify-center">
                    <IconButton
                      onClick={() => experiences.remove(index)}
                      size="small"
                    >
                      <DeleteSharp color="error" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
        </div>
      </FormSection>
      {/* Education */}
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
                  className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3"
                >
                  {/* Institute */}
                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`education.${index}.institute`}
                      render={({ field, fieldState }) => (
                        <TextField
                          label="Institute"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          fullWidth
                          error={!!fieldState.error}
                          helperText={
                            errors.education?.[index]?.institute?.message
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Qualification */}
                  <div className="w-full lg:col-span-4">
                    <Controller
                      control={control}
                      name={`education.${index}.qualification`}
                      render={({ field, fieldState }) => (
                        <TextField
                          label="Qualification"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          fullWidth
                          error={!!fieldState.error}
                          helperText={
                            errors.education?.[index]?.qualification?.message
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Year */}
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
                        />
                      )}
                    />
                  </div>

                  {/* Remove button only (no up/down) */}
                  <div className="flex gap-2 justify-center">
                    <IconButton
                      onClick={() => education.remove(index)}
                      size="small"
                    >
                      <DeleteSharp color="error" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
        </div>
      </FormSection>
    </div>
  );
}
