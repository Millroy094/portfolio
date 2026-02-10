"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import {
  ArrowUpwardSharp,
  ArrowDownwardSharp,
  DeleteSharp
} from "@mui/icons-material";
import SkillSelect from "@/components/controls/SkillSelect";
import LinkTextField from "@/components/controls/LinkTextField";
import { FormSection } from "@/components/FormSection";
import { ProfileSchemaType } from "@/app/admin/schema";
import { SkillId } from "@/components/controls/SkillSelect/SkillRegistery";

type ProjectRecord = {
    name: string
    description: string
    url: string
}

export interface ProjectsSkillsProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  projects: {
    fields: { id: string }[];
    append: (v: ProjectRecord) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
  };
}

export default function ProjectsSkillsSection({
  control,
  errors,
  projects
}: ProjectsSkillsProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Skills */}
      <div className="w-full">
        <Controller
          name="skills"
          control={control}
          render={({ field, fieldState }) => (
            <SkillSelect
              value={(field.value ?? []) as SkillId[]}
              onChangeAction={(ids: string[]) => field.onChange(ids)}
              onBlurAction={field.onBlur}
              name={field.name}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Projects */}
      <FormSection
        title="Projects"
        description="Showcase your projects with a short description and repository/demo URL."
        addLabel="Add project"
        onAdd={() =>
          projects.append({
            name: "",
            description: "",
            url: ""
          })
        }
        count={projects.fields.length}
      >
        <div className="flex flex-col gap-4">
          {projects.fields.map((project, index) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3"
            >
              {/* Name */}
              <div className="w-full lg:col-span-2">
                <Controller
                  control={control}
                  name={`projects.${index}.name`}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Project name"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={errors.projects?.[index]?.name?.message}
                    />
                  )}
                />
              </div>

              {/* Description */}
              <div className="w-full lg:col-span-5">
                <Controller
                  control={control}
                  name={`projects.${index}.description`}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Description"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        errors.projects?.[index]?.description?.message
                      }
                    />
                  )}
                />
              </div>

              {/* URL */}
              <div className="w-full lg:col-span-4">
                <Controller
                  control={control}
                  name={`projects.${index}.url`}
                  render={({ field, fieldState }) => (
                    <LinkTextField
                      label="Repository URL"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      errorText={errors.projects?.[index]?.url?.message}
                    />
                  )}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-1 lg:gap-2 lg:col-span-1 lg:justify-end justify-center">
                <IconButton
                  onClick={() => index > 0 && projects.move(index, index - 1)}
                  disabled={index === 0}
                  size="small"
                >
                  <ArrowUpwardSharp />
                </IconButton>

                <IconButton
                  onClick={() =>
                    index < projects.fields.length - 1 &&
                    projects.move(index, index + 1)
                  }
                  disabled={index === projects.fields.length - 1}
                  size="small"
                >
                  <ArrowDownwardSharp />
                </IconButton>

                <IconButton onClick={() => projects.remove(index)} size="small">
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
