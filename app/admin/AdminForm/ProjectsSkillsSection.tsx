"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import LinkTextField from "@/components/controls/LinkTextField";
import SkillSelect from "@/components/controls/SkillSelect";
import { SkillId } from "@/components/controls/SkillSelect/SkillRegistery";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ProjectRecord = {
  name: string;
  description: string;
  url: string;
};

export interface ProjectsSkillsProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  projects: {
    fields: { id: string }[];
    append: (v: ProjectRecord) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
  };
  disabled: boolean;
}

export default function ProjectsSkillsSection({
  control,
  errors,
  projects,
  disabled,
}: ProjectsSkillsProps) {
  return (
    <div className="flex flex-col gap-8">
      <FormSection
        title="Skills"
        description="Select the skills you want to highlight."
        visKey="skills"
        showVisibilityToggle
        showAddButton={false}
        count={1}
        disabled={disabled}
      >
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
              disabled={disabled}
            />
          )}
        />
      </FormSection>

      <FormSection
        title="Projects"
        description="Showcase your projects with a short description and repository/demo URL."
        addLabel="Add project"
        onAdd={() =>
          projects.append({
            name: "",
            description: "",
            url: "",
          })
        }
        showVisibilityToggle
        visKey="projects"
        count={projects.fields.length}
        disabled={disabled}
        showAddButton
      >
        <div className="flex flex-col gap-4">
          {projects.fields.map((project, index) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-start"
            >
              <div className="w-full lg:col-span-2">
                <Controller
                  control={control}
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <Field
                      label="Project name"
                      error={errors.projects?.[index]?.name?.message}
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
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <Field
                      label="Project Description"
                      error={errors.projects?.[index]?.description?.message}
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
                  name={`projects.${index}.url`}
                  render={({ field, fieldState }) => (
                    <LinkTextField
                      label="Repository URL"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      errorText={errors.projects?.[index]?.url?.message}
                      disabled={disabled}
                    />
                  )}
                />
              </div>

              <div className="flex w-full items-center justify-center gap-2 lg:col-span-2 lg:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => index > 0 && projects.move(index, index - 1)}
                  disabled={disabled || index === 0}
                  className="h-10 w-10"
                  aria-label={`Move project ${index + 1} up`}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    index < projects.fields.length - 1 && projects.move(index, index + 1)
                  }
                  disabled={disabled || index === projects.fields.length - 1}
                  className="h-10 w-10"
                  aria-label={`Move project ${index + 1} down`}
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => projects.remove(index)}
                  disabled={disabled}
                  className="h-10 w-10"
                  aria-label={`Remove project ${index + 1}`}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}
