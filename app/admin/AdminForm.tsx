"use client";

import Image from "next/image";
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
  Avatar,
  Select,
  MenuItem
} from "@mui/material";
import {
  DeleteSharp,
  ArrowUpwardSharp,
  ArrowDownwardSharp,
  Person2,
  AddModerator, GitHub, School, EmojiTransportation, Engineering, AccountCircle, Save
} from "@mui/icons-material";
import RichTextEditor from "@/components/controls/RichTextEditor";
import { ProfileSchema, ProfileSchemaType } from "@/app/admin/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LinkTextField from "@/components/controls/LinkTextField";
import AvatarCropper from "@/components/controls/AvatorCropper";
import { useState } from "react";

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
  } = useFieldArray({
    control,
    name: "roles"
  });

  const {
    fields: badges,
    append: addBadge,
    remove: removeBadge
  } = useFieldArray({
    control,
    name: "badges"
  });

  const {
    fields: experiences,
    append: addExperience,
    remove: removeExperience,
    move: moveExperience
  } = useFieldArray({
    control,
    name: "experiences"
  });

  const {
    fields: education,
    append: addEducation,
    remove: removeEducation,
    move: moveEducation
  } = useFieldArray({
    control,
    name: "education"
  });

  const {
    fields: projects,
    append: addProject,
    remove: removeProject,
    move: moveProject
  } = useFieldArray({
    control,
    name: "projects"
  });

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const onSubmit: SubmitHandler<ProfileSchemaType> = data => console.log(data);
  return (
    <Card>
      <form
        className="flex flex-col p-8 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
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

              <AvatarCropper
                open={cropOpen}
                file={cropFile}
                onClose={() => setCropOpen(false)}
                onCropped={(croppedFile: File) => field.onChange(croppedFile)}
              />
            </>
          )}
        />
        <div className="w-full md:w-1/4">
          <TextField
            label="Full Name"
            fullWidth
            {...register("fullName", { required: false })}
            error={!!errors.fullName}
            helperText={errors.fullName?.message ?? ""}
          />
        </div>

        {roles.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Roles</h3>

            {roles.map((role, index) => (
              <div key={role.id} className="flex items-center gap-4">
                <Controller
                  control={control}
                  name={`roles.${index}`}
                  render={({ field, fieldState }) => (
                    <TextField
                      label={`Role ${index + 1}`}
                      value={field.value.value ?? ""}
                      onChange={e => {
                        field.onChange({ value: e.target.value });
                      }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={errors.roles?.[index]?.value?.message}
                    />
                  )}
                />

                <IconButton
                  onClick={() => index > 0 && moveRole(index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUpwardSharp />
                </IconButton>

                <IconButton
                  onClick={() =>
                    index < roles.length - 1 && moveRole(index, index + 1)
                  }
                  disabled={index === roles.length - 1}
                >
                  <ArrowDownwardSharp />
                </IconButton>

                <IconButton onClick={() => removeRole(index)}>
                  <DeleteSharp color="error" />
                </IconButton>
              </div>
            ))}
          </div>
        )}

        <div className="w-full md:w-1/2">
          <TextField
            label="Punch line"
            fullWidth
            {...register("punchLine", { required: false })}
            error={!!errors.punchLine}
            helperText={errors.punchLine?.message ?? ""}
          />
        </div>
        <div className="flex md:flex-row flex-col gap-4">
          <div className="w-full md:w-1/3">
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
          <div className="w-full md:w-1/3">
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
          <div className="w-full md:w-1/3">
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
        <div>
          <Controller
            name="aboutMe"
            control={control}
            rules={{ required: "About me is required" }}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <RichTextEditor
                  placeholder="Please write a bit about yourself"
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <FormHelperText sx={{ pl: 2 }} error>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </div>
            )}
          />
        </div>
        {badges.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Badges</h3>
            <div className="grid grid-cols-12 gap-4">
              {badges.map((badge, index) => {
                const val = badge.value;

                const isUrlBadge =
                  val &&
                  typeof val === "object" &&
                  "value" in val &&
                  typeof val.value === "string";

                const isFileBadge = val instanceof File;

                return (
                  <div
                    key={badge.id}
                    className="relative"
                    style={{ minHeight: "150px", maxHeight: "150px" }}
                  >
                    {isUrlBadge && (
                      <Image
                        alt={`badge ${index + 1}`}
                        src={val.value as string}
                        fill
                        className="rounded border object-cover"
                      />
                    )}

                    {isFileBadge && (
                      <Image
                        alt={`badge ${index + 1}`}
                        src={URL.createObjectURL(val)}
                        fill
                        className="rounded border object-cover"
                        unoptimized
                      />
                    )}

                    <IconButton
                      type="button"
                      onClick={() => removeBadge(index)}
                      color="error"
                      className="absolute top-0 left-30 bg-red-500 text-white rounded-full p-1"
                    >
                      <DeleteSharp color="error" />
                    </IconButton>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Experiences</h3>
            {experiences.map((experience, index) => (
              <div key={experience.id} className="flex items-center gap-4">
                <div className="w-full md:w-1/4">
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
                <div className="w-full md:w-1/4">
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
                <div className="w-full md:w-1/4">
                  <Controller
                      control={control}
                      name={`experiences.${index}.year`}
                      render={({ field, fieldState }) => (
                          <TextField
                              type="number"
                              label="Year"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (v === "") {
                                  field.onChange(undefined);
                                  return;
                                }
                                const parsed = Number(v);
                                field.onChange(Number.isNaN(parsed) ? undefined : parsed);
                              }}
                              inputProps={{ inputMode: "numeric", min: 1900, max: new Date().getFullYear(), step: 1 }}
                              fullWidth
                              error={!!fieldState.error}
                              helperText={errors.experiences?.[index]?.year?.message}
                          />
                      )}
                  />
                </div>
                <IconButton
                  onClick={() => index > 0 && moveExperience(index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUpwardSharp />
                </IconButton>

                <IconButton
                  onClick={() =>
                    index < roles.length - 1 && moveExperience(index, index + 1)
                  }
                  disabled={index === roles.length - 1}
                >
                  <ArrowDownwardSharp />
                </IconButton>

                <IconButton onClick={() => removeExperience(index)}>
                  <DeleteSharp color="error" />
                </IconButton>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Education</h3>
              {education.map((edu, index) => (
                  <div key={edu.id} className="flex items-center gap-4">
                    <div className="w-full md:w-1/4">
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
                    <div className="w-full md:w-1/4">
                      <Controller
                          control={control}
                          name={`education.${index}.qualification`}
                          render={({ field, fieldState }) => (
                              <TextField
                                  label="Qualificaion"
                                  value={field.value}
                                  onChange={e => field.onChange(e.target.value)}
                                  fullWidth
                                  error={!!fieldState.error}
                                  helperText={errors.education?.[index]?.qualification?.message}
                              />
                          )}
                      />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Controller
                          control={control}
                          name={`education.${index}.year`}
                          render={({ field, fieldState }) => (
                              <TextField
                                  type="number"
                                  label="Year"
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    if (v === "") {
                                      field.onChange(undefined);
                                      return;
                                    }
                                    const parsed = Number(v);
                                    field.onChange(Number.isNaN(parsed) ? undefined : parsed);
                                  }}
                                  inputProps={{ inputMode: "numeric", min: 1900, max: new Date().getFullYear(), step: 1 }}
                                  fullWidth
                                  error={!!fieldState.error}
                                  helperText={errors.education?.[index]?.year?.message}
                              />
                          )}
                      />
                    </div>
                    <IconButton
                        onClick={() => index > 0 && moveEducation(index, index - 1)}
                        disabled={index === 0}
                    >
                      <ArrowUpwardSharp />
                    </IconButton>

                    <IconButton
                        onClick={() =>
                            index < roles.length - 1 && moveEducation(index, index + 1)
                        }
                        disabled={index === roles.length - 1}
                    >
                      <ArrowDownwardSharp />
                    </IconButton>

                    <IconButton onClick={() => removeEducation(index)}>
                      <DeleteSharp color="error" />
                    </IconButton>
                  </div>
              ))}
            </div>
        )}

        {projects.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Projects</h3>
              {projects.map((project, index) => (
                  <div key={project.id} className="flex items-center gap-4">
                    <div className="w-full md:w-1/4">
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
                                  helperText={
                                    errors.projects?.[index]?.name?.message
                                  }
                              />
                          )}
                      />
                    </div>
                    <div className="w-full md:w-1/2">
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
                                  helperText={errors.projects?.[index]?.description?.message}
                              />
                          )}
                      />
                    </div>
                    <div className="w-full md:w-1/4">
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
                    <IconButton
                        onClick={() => index > 0 && moveProject(index, index - 1)}
                        disabled={index === 0}
                    >
                      <ArrowUpwardSharp />
                    </IconButton>

                    <IconButton
                        onClick={() =>
                            index < roles.length - 1 && moveProject(index, index + 1)
                        }
                        disabled={index === roles.length - 1}
                    >
                      <ArrowDownwardSharp />
                    </IconButton>

                    <IconButton onClick={() => removeProject(index)}>
                      <DeleteSharp color="error" />
                    </IconButton>
                  </div>
              ))}
            </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
              type="button"
              variant="contained"
              onClick={() =>
                  addProject({ name: "", url: "", description: "" })
              }
              startIcon={<GitHub />}
              color='inherit'
          >
            Add Project
          </Button>
          <Button
              type="button"
              variant="contained"
              onClick={() =>
                  addEducation({ year: 2026, institute: "", qualification: "" })
              }
              startIcon={<School />}
              color='secondary'

          >
            Add Education
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={() =>
              addExperience({ year: 2026, organization: "", title: "" })
            }
            startIcon={<EmojiTransportation />}
            color='info'

          >
            Add Experience
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={() => addRole({ value: "" })}
            startIcon={<Engineering />}
            color='primary'
          >
            Add Role
          </Button>
          <Button
            variant="contained"
            component="label"
            startIcon={<AddModerator />}
            color='warning'
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) addBadge({ value: file });
              }}
            />
            Add Badge
          </Button>
          <Button variant="contained" component="label"  color='error'           startIcon={<AccountCircle />}
          >
            Choose Avatar
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setCropFile(file);
                  setCropOpen(true);
                }
              }}
            />
          </Button>
          <Button type="submit" variant="contained" color='success'  startIcon={<Save />}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
