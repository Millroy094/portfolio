"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm
} from "react-hook-form";
import {
  Card,
  TextField,
  Button,
  FormHelperText,
  IconButton,
  Avatar
} from "@mui/material";
import {
  DeleteSharp,
  ArrowUpwardSharp,
  ArrowDownwardSharp,
  Person2,
  AccountCircle,
  Save
} from "@mui/icons-material";

import RichTextEditor from "@/components/controls/RichTextEditor";
import LinkTextField from "@/components/controls/LinkTextField";
import AvatarCropper from "@/components/controls/AvatorCropper";
import SkillSelect from "@/components/controls/SkillSelect";
import { SkillId } from "@/components/controls/SkillSelect/SkillRegistery";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, ProfileSchemaType } from "@/app/admin/schema";

import { FormSection } from "@/components/FormSection";

export default function AdminForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      roles: [{ value: "" }],
      badges: [],
      avatar: ""
    }
  });

  const {
    fields: roles,
    append: addRole,
    remove: removeRole,
    move: moveRole
  } = useFieldArray({ control, name: "roles" });

  const {
    fields: badges,
    append: addBadge,
    remove: removeBadge
  } = useFieldArray({ control, name: "badges" });

  const {
    fields: experiences,
    append: addExperience,
    remove: removeExperience,
    move: moveExperience
  } = useFieldArray({ control, name: "experiences" });

  const {
    fields: education,
    append: addEducation,
    remove: removeEducation,
    move: moveEducation
  } = useFieldArray({ control, name: "education" });

  const {
    fields: projects,
    append: addProject,
    remove: removeProject,
    move: moveProject
  } = useFieldArray({ control, name: "projects" });

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const badgeFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0];

    if (avatarInputRef.current) avatarInputRef.current.value = "";

    if (!file) return;

    setCropFile(file);
    setCropOpen(true);
  };

  const onSubmit: SubmitHandler<ProfileSchemaType> = data =>
    console.log("Form submitted:", data);

  return (
    <Card>
      {/* Mobile-first: tight padding on xs, scale up on sm+ */}
      <form
        className="flex flex-col p-4 sm:p-6 md:p-8 gap-4 sm:gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="file"
          accept="image/*"
          hidden
          ref={avatarInputRef}
          onChange={handleAvatarFileChange}
        />

        <input
          type="file"
          accept="image/*"
          hidden
          ref={badgeFileInputRef}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) addBadge({ value: file });
            if (badgeFileInputRef.current) badgeFileInputRef.current.value = "";
          }}
        />

        {/* Header / Identity */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <>
                {field.value instanceof File ? (
                  <Image
                    alt="profile picture"
                    width={100}
                    height={100}
                    src={URL.createObjectURL(field.value)}
                    className="h-24 w-24 rounded-full border object-cover"
                  />
                ) : (
                  <Avatar sx={{ width: "100px", height: "100px" }}>
                    <Person2 fontSize="large" />
                  </Avatar>
                )}

                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  startIcon={<AccountCircle />}
                  onClick={() => avatarInputRef.current?.click()}
                  // Bigger touch target on mobile
                  sx={{ width: "100%", maxWidth: 320 }}
                >
                  Choose Avatar
                </Button>

                <AvatarCropper
                  open={cropOpen}
                  file={cropFile}
                  onClose={() => setCropOpen(false)}
                  onCropped={(croppedFile: File) => field.onChange(croppedFile)}
                />
              </>
            )}
          />
        </div>

        {/* Full name – full width on mobile; constrain only on larger screens */}
        <div className="w-full md:max-w-xl">
          <TextField
            label="Full Name"
            fullWidth
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message ?? ""}
          />
        </div>

        {/* Roles section */}
        <FormSection
          title="Roles"
          description="Document specific roles you’ve held (e.g., Team Lead, Reviewer, Maintainer)."
          addLabel="Add role"
          onAdd={() => addRole({ value: "" })}
          count={roles.length}
        >
          <div className="flex flex-col gap-4">
            {roles.map((role, index) => (
              <div
                key={role.id}
                className="
                  flex flex-col gap-2
                  sm:grid sm:grid-cols-12 sm:items-start sm:gap-3
                "
              >
                {/* Input spans across on mobile; on sm+ take 10/12 columns */}
                <div className="w-full sm:col-span-10">
                  <Controller
                    control={control}
                    name={`roles.${index}`}
                    render={({ field, fieldState }) => (
                      <TextField
                        label={`Role ${index + 1}`}
                        value={field.value.value ?? ""}
                        onChange={e =>
                          field.onChange({ value: e.target.value })
                        }
                        fullWidth
                        error={!!fieldState.error}
                        helperText={errors.roles?.[index]?.value?.message}
                      />
                    )}
                  />
                </div>

                {/* Action buttons – stacked/inline on mobile, right-aligned on sm+ */}
                <div className="flex gap-1 sm:gap-2 sm:col-span-2 sm:justify-end">
                  <IconButton
                    aria-label="Move up"
                    onClick={() => index > 0 && moveRole(index, index - 1)}
                    disabled={index === 0}
                    size="small"
                  >
                    <ArrowUpwardSharp />
                  </IconButton>
                  <IconButton
                    aria-label="Move down"
                    onClick={() =>
                      index < roles.length - 1 && moveRole(index, index + 1)
                    }
                    disabled={index === roles.length - 1}
                    size="small"
                  >
                    <ArrowDownwardSharp />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => removeRole(index)}
                    size="small"
                  >
                    <DeleteSharp color="error" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Punch line – full width by default */}
        <div className="w-full md:w-1/2">
          <TextField
            label="Punch line"
            fullWidth
            {...register("punchLine")}
            error={!!errors.punchLine}
            helperText={errors.punchLine?.message ?? ""}
          />
        </div>

        {/* Links – stack on mobile, 2-col on sm, 3-col on md */}
        <div
          className="
            grid grid-cols-1 gap-4
            sm:grid-cols-2
            md:grid-cols-3
          "
        >
          <div className="w-full">
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
                />
              )}
            />
          </div>
          <div className="w-full">
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
                />
              )}
            />
          </div>
          <div className="w-full">
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
                />
              )}
            />
          </div>
        </div>

        {/* Resume – full width by default */}
        <div className="w-full md:w-1/2">
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
              />
            )}
          />
        </div>

        {/* About me – full width, mobile-friendly helper text spacing */}
        <div className="w-full">
          <Controller
            name="aboutMe"
            control={control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <RichTextEditor
                  placeholder="Please write a bit about yourself"
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <FormHelperText sx={{ pl: 1 }} error>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </div>
            )}
          />
        </div>

        {/* Skills – full width */}
        <div className="w-full">
          <Controller
            name="skills"
            control={control}
            render={({ field, fieldState }) => (
              <SkillSelect
                value={(field.value ?? []) as SkillId[]}
                onChange={(ids: string[]) => field.onChange(ids)}
                onBlur={field.onBlur}
                name={field.name}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Badges section – mobile-first grid (2 cols on xs, 3 on sm, 4 on md) */}
        <FormSection
          title="Badges"
          description="Add badges or certifications. Use a URL badge image or upload a file."
          addLabel="Add badge"
          onAdd={() => badgeFileInputRef.current?.click()}
          count={badges.length}
        >
          <div
            className="
              grid gap-3
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-4
            "
          >
            {badges.map((badge, index) => {
              const val = badge.value;
              const isUrlBadge =
                val &&
                typeof val === "object" &&
                "value" in val &&
                typeof (val as any).value === "string";
              const isFileBadge = val instanceof File;

              return (
                <div
                  key={badge.id}
                  className="relative rounded border bg-white/70 dark:bg-white/10"
                  style={{ minHeight: 150, maxHeight: 150 }}
                >
                  {/* Optional: helper background for transparency */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5),linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5)] bg-[size:16px_16px] bg-[position:0_0,8px_8px] opacity-30" />

                  {isUrlBadge && (
                    <Image
                      alt={`badge ${index + 1}`}
                      src={(val as any).value as string}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      // Consider placeholder when you can
                      // placeholder="blur" blurDataURL="/blur-placeholder.png"
                    />
                  )}
                  {isFileBadge && (
                    <Image
                      alt={`badge ${index + 1}`}
                      src={URL.createObjectURL(val)}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                  )}
                  <div className="absolute top-1 right-1">
                    <IconButton
                      type="button"
                      onClick={() => removeBadge(index)}
                      color="error"
                      size="small"
                      className="bg-white/80 hover:bg-white"
                      aria-label={`Remove badge ${index + 1}`}
                    >
                      <DeleteSharp color="error" fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        </FormSection>

        {/* Experiences – stack fields; use grid on sm+ */}
        <FormSection
          title="Experiences"
          description="Add organizations, titles, and the year for each role you’ve held."
          addLabel="Add experience"
          onAdd={() =>
            addExperience({ year: 2026, organization: "", title: "" })
          }
          count={experiences.length}
        >
          <div className="flex flex-col gap-4">
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className="
                  flex flex-col gap-2
                  sm:grid sm:grid-cols-12 sm:gap-3
                "
              >
                <div className="w-full sm:col-span-4">
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

                <div className="w-full sm:col-span-4">
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

                <div className="w-full sm:col-span-3">
                  <Controller
                    control={control}
                    name={`experiences.${index}.year`}
                    render={({ field, fieldState }) => (
                      <TextField
                        type="number"
                        label="Year"
                        value={field.value ?? ""}
                        onChange={e => {
                          const v = e.target.value;
                          if (v === "") return field.onChange(undefined);
                          const parsed = Number(v);
                          field.onChange(
                            Number.isNaN(parsed) ? undefined : parsed
                          );
                        }}
                        inputProps={{
                          inputMode: "numeric",
                          min: 1900,
                          max: new Date().getFullYear(),
                          step: 1
                        }}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={errors.experiences?.[index]?.year?.message}
                      />
                    )}
                  />
                </div>

                <div className="flex gap-1 sm:gap-2 sm:col-span-1 sm:justify-end">
                  <IconButton
                    onClick={() =>
                      index > 0 && moveExperience(index, index - 1)
                    }
                    disabled={index === 0}
                    size="small"
                    aria-label="Move up"
                  >
                    <ArrowUpwardSharp />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      index < experiences.length - 1 &&
                      moveExperience(index, index + 1)
                    }
                    disabled={index === experiences.length - 1}
                    size="small"
                    aria-label="Move down"
                  >
                    <ArrowDownwardSharp />
                  </IconButton>

                  <IconButton
                    onClick={() => removeExperience(index)}
                    size="small"
                    aria-label="Delete"
                  >
                    <DeleteSharp color="error" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Education – similar layout to experiences */}
        <FormSection
          title="Education"
          description="List your education—include institute, qualification, and year."
          addLabel="Add education"
          onAdd={() =>
            addEducation({ year: 2026, institute: "", qualification: "" })
          }
          count={education.length}
        >
          <div className="flex flex-col gap-4">
            {education.map((edu, index) => (
              <div
                key={edu.id}
                className="
                  flex flex-col gap-2
                  sm:grid sm:grid-cols-12 sm:gap-3
                "
              >
                <div className="w-full sm:col-span-4">
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
                        helperText={
                          errors.education?.[index]?.institute?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="w-full sm:col-span-4">
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

                <div className="w-full sm:col-span-3">
                  <Controller
                    control={control}
                    name={`education.${index}.year`}
                    render={({ field, fieldState }) => (
                      <TextField
                        type="number"
                        label="Year"
                        value={field.value ?? ""}
                        onChange={e => {
                          const v = e.target.value;
                          if (v === "") return field.onChange(undefined);
                          const parsed = Number(v);
                          field.onChange(
                            Number.isNaN(parsed) ? undefined : parsed
                          );
                        }}
                        inputProps={{
                          inputMode: "numeric",
                          min: 1900,
                          max: new Date().getFullYear(),
                          step: 1
                        }}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={errors.education?.[index]?.year?.message}
                      />
                    )}
                  />
                </div>

                <div className="flex gap-1 sm:gap-2 sm:col-span-1 sm:justify-end">
                  <IconButton
                    onClick={() => index > 0 && moveEducation(index, index - 1)}
                    disabled={index === 0}
                    size="small"
                    aria-label="Move up"
                  >
                    <ArrowUpwardSharp />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      index < education.length - 1 &&
                      moveEducation(index, index + 1)
                    }
                    disabled={index === education.length - 1}
                    size="small"
                    aria-label="Move down"
                  >
                    <ArrowDownwardSharp />
                  </IconButton>

                  <IconButton
                    onClick={() => removeEducation(index)}
                    size="small"
                    aria-label="Delete"
                  >
                    <DeleteSharp color="error" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Projects – mobile-first layout */}
        <FormSection
          title="Projects"
          description="Showcase your projects with a short description and repository or demo URL."
          addLabel="Add project"
          onAdd={() => addProject({ name: "", url: "", description: "" })}
          count={projects.length}
        >
          <div className="flex flex-col gap-4">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="
                  flex flex-col gap-2
                  sm:grid sm:grid-cols-12 sm:gap-3
                "
              >
                <div className="w-full sm:col-span-3">
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

                <div className="w-full sm:col-span-6">
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

                <div className="w-full sm:col-span-3">
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

                <div className="flex gap-1 sm:gap-2 sm:col-span-12 sm:justify-end">
                  <IconButton
                    onClick={() => index > 0 && moveProject(index, index - 1)}
                    disabled={index === 0}
                    size="small"
                    aria-label="Move up"
                  >
                    <ArrowUpwardSharp />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      index < projects.length - 1 &&
                      moveProject(index, index + 1)
                    }
                    disabled={index === projects.length - 1}
                    size="small"
                    aria-label="Move down"
                  >
                    <ArrowDownwardSharp />
                  </IconButton>

                  <IconButton
                    onClick={() => removeProject(index)}
                    size="small"
                    aria-label="Delete"
                  >
                    <DeleteSharp color="error" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Save – full width on mobile; right-aligned on sm+ */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={<Save />}
            sx={{ width: "100%", sm: { width: "auto" } }}
          >
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
