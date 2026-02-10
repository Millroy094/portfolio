"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import {
  ArrowUpwardSharp,
  ArrowDownwardSharp,
  DeleteSharp
} from "@mui/icons-material";
import { FormSection } from "@/components/FormSection";
import YearTextField from "@/components/controls/YearTextField";
import { ProfileSchemaType } from "@/app/admin/schema";

type ExperienceRecord = {
    year: number;
    organization: string;
    title: string;
}

type EducationRecord = {
    year: number;
    institute: string;
    qualification: string;
}

export interface ExperiencesEducationProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  experiences: {
    fields: { id: string }[];
    append: (v: ExperienceRecord) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
  };
  education: {
    fields: { id: string }[];
    append: (v: EducationRecord) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
  };
}

const currentYear = new Date().getFullYear();

export default function ExperiencesEducationSection({
  control,
  errors,
  experiences,
  education
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
            title: ""
          })
        }
        count={experiences.fields.length}
      >
        <div className="flex flex-col gap-4">
          {experiences.fields.map((exp, index) => (
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
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      fullWidth
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
                      label="Title"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={errors.experiences?.[index]?.title?.message}
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

              {/* Buttons */}
              <div className="flex gap-1 lg:gap-2 lg:col-span-1 lg:justify-end justify-center">
                <IconButton
                  onClick={() =>
                    index > 0 && experiences.move(index, index - 1)
                  }
                  disabled={index === 0}
                  size="small"
                >
                  <ArrowUpwardSharp />
                </IconButton>

                <IconButton
                  onClick={() =>
                    index < experiences.fields.length - 1 &&
                    experiences.move(index, index + 1)
                  }
                  disabled={index === experiences.fields.length - 1}
                  size="small"
                >
                  <ArrowDownwardSharp />
                </IconButton>

                <IconButton
                  onClick={() => experiences.remove(index)}
                  size="small"
                >
                  <DeleteSharp color="error" />
                </IconButton>
              </div>
            </div>
          ))}
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
            qualification: ""
          })
        }
        count={education.fields.length}
      >
        <div className="flex flex-col gap-4">
          {education.fields.map((edu, index) => (
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
                      onChange={e => field.onChange(e.target.value)}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={errors.education?.[index]?.institute?.message}
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
                      onChange={e => field.onChange(e.target.value)}
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

              {/* Buttons */}
              <div className="flex gap-1 lg:gap-2 lg:col-span-1 lg:justify-end justify-center">
                <IconButton
                  onClick={() => index > 0 && education.move(index, index - 1)}
                  disabled={index === 0}
                  size="small"
                >
                  <ArrowUpwardSharp />
                </IconButton>

                <IconButton
                  onClick={() =>
                    index < education.fields.length - 1 &&
                    education.move(index, index + 1)
                  }
                  disabled={index === education.fields.length - 1}
                  size="small"
                >
                  <ArrowDownwardSharp />
                </IconButton>

                <IconButton
                  onClick={() => education.remove(index)}
                  size="small"
                >
                  <DeleteSharp color="error" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}
