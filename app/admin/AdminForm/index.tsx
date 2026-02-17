"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, LockSharp } from "@mui/icons-material";
import { Card, Button, Alert } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FieldErrors,
  FieldError,
  FormProvider,
} from "react-hook-form";
import { Atom } from "react-loading-indicators";
import { ToastContainer, toast } from "react-toastify";

import { getProfileData } from "@/app/admin/AdminForm/actions/getProfileData";
import { saveProfileData } from "@/app/admin/AdminForm/actions/saveProfileData";
import { ProfileSchema, ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import SeoSection from "@/app/admin/AdminForm/SeoSection";
import { uploadFileToS3 } from "@/services/amplify/storage/uploadFileToS3";

import AboutMeSection from "./AboutMeSection";
import AvatarSection from "./AvatarSection";
import BadgesSection from "./BadgesSection";
import ExperiencesAndEducationSection from "./ExperiencesAndEducationSection";
import IdentitySection from "./IdentitySection";
import ProjectsSkillsSection from "./ProjectsSkillsSection";
import RolesSection from "./RolesSection";

export default function AdminForm() {
  const [formId, setFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const methods = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      roles: [],
      badges: [],
      avatar: "",
      experiences: [],
      education: [],
      projects: [],
      skills: [],
      visibility: {
        roles: true,
        badges: true,
        aboutMe: true,
        experiences: true,
        education: true,
        projects: true,
        skills: true,
      },
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { profileId, data } = await getProfileData();

        if (data && profileId) {
          setFormId(profileId);
          reset(data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to retrieve profile");
      }

      setLoading(false);
    }
    load();
  }, [reset]);

  const roles = useFieldArray({ control, name: "roles" });
  const badges = useFieldArray({ control, name: "badges" });
  const experiences = useFieldArray({ control, name: "experiences" });
  const education = useFieldArray({ control, name: "education" });
  const projects = useFieldArray({ control, name: "projects" });

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const badgeFileInputRef = useRef<HTMLInputElement | null>(null);

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const handleAvatarFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (avatarInputRef.current) avatarInputRef.current.value = "";
    if (!file) return;
    setCropFile(file);
    setCropOpen(true);
  };

  const uploadAssets = async (data: ProfileSchemaType) => {
    const avatarKey = await uploadFileToS3("avatars", data.avatar);

    if (!data.badges?.length) {
      return { badgeKeys: [], avatarKey };
    }

    const uploads = await Promise.all(
      data.badges.map(async (i) => {
        const key = await uploadFileToS3("badges", i.value);
        return { key, label: i.label };
      }),
    );

    const badgeKeyLabels = uploads.filter(
      (x): x is { key: string; label: string } => x.key !== null && x.label !== null,
    );

    return { badgeKeyLabels, avatarKey };
  };
  const handleBadgeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png") {
      toast.error("Only PNG files are allowed.", {
        theme: "colored",
      });
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;

      if (width !== height) {
        toast.error("Image must be 1:1 aspect ratio (square).", {
          theme: "colored",
        });
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const pixelData = ctx.getImageData(0, 0, width, height).data;

      let hasTransparency = false;
      for (let i = 3; i < pixelData.length; i += 4) {
        if (pixelData[i] < 255) {
          hasTransparency = true;
          break;
        }
      }

      if (!hasTransparency) {
        toast.error("PNG must have a transparent background.", {
          theme: "colored",
        });
        return;
      }

      badges.append({ value: file, label: "" });
    };

    if (badgeFileInputRef.current) {
      badgeFileInputRef.current.value = "";
    }
  };

  const isFieldError = (err: unknown): err is FieldError => {
    return typeof err === "object" && err !== null && "message" in err;
  };

  const showErrors = (errorObj: FieldErrors<ProfileSchemaType>) => {
    if (!errorObj) return;

    Object.values(errorObj).forEach((err) => {
      if (!err) return;

      if (isFieldError(err)) {
        toast.error(err.message, { theme: "colored" });
        return;
      }

      if (typeof err === "object") {
        showErrors(err as FieldErrors<ProfileSchemaType>);
      }
    });
  };

  const onInvalid = (errors: FieldErrors<ProfileSchemaType>) => {
    showErrors(errors);
  };

  const onSubmit: SubmitHandler<ProfileSchemaType> = async (data) => {
    setIsEditable(false);
    setProcessing(true);
    try {
      const assets = await uploadAssets(data);
      const result = await saveProfileData(data, formId, assets);
      const { profileId } = result;
      if (profileId && formId !== profileId) {
        setFormId(profileId);
      }
      toast.success("Successfully saved profile", { theme: "colored" });
    } catch (error) {
      console.log(error);
      toast.error("There was an error while saving profile", {
        theme: "colored",
      });
    }
    setProcessing(false);
    setIsEditable(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Atom color="#32cd32" size="large" text="" textColor="loading" />
      </Box>
    );
  }

  return (
    <Card>
      <ToastContainer />

      {!isEditable && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            borderRadius: 2,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          This form is currently in read‑only mode. Click Edit to make changes.
        </Alert>
      )}

      <div className="flex justify-end p-4 gap-2">
        <Button
          variant="outlined"
          color={isEditable ? "warning" : "primary"}
          onClick={() => setIsEditable((prev) => !prev)}
          startIcon={isEditable ? <LockSharp /> : <Edit />}
        >
          {isEditable ? "Lock" : "Edit"}
        </Button>
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col p-4 sm:p-6 md:p-8 gap-6"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
          {/* Hidden Inputs */}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={avatarInputRef}
            onChange={handleAvatarFileChange}
          />
          <input
            type="file"
            accept="image/png"
            hidden
            ref={badgeFileInputRef}
            onChange={handleBadgeFile}
          />

          {/* Sections */}
          <AvatarSection
            errors={errors}
            control={control}
            cropOpen={cropOpen}
            cropFile={cropFile}
            setCropOpen={setCropOpen}
            avatarInputRef={avatarInputRef}
            disabled={!isEditable}
          />

          <IdentitySection
            register={register}
            control={control}
            errors={errors}
            disabled={!isEditable}
          />

          <RolesSection
            control={control}
            errors={errors}
            fields={roles.fields}
            append={roles.append}
            remove={roles.remove}
            disabled={!isEditable}
          />

          <BadgesSection
            control={control}
            errors={errors}
            fields={badges.fields}
            remove={badges.remove}
            badgeFileInputRef={badgeFileInputRef}
            disabled={!isEditable}
          />

          <AboutMeSection control={control} errors={errors} disabled={!isEditable} />

          <ExperiencesAndEducationSection
            control={control}
            errors={errors}
            experiences={{
              fields: experiences.fields,
              append: experiences.append,
              remove: experiences.remove,
            }}
            education={{
              fields: education.fields,
              append: education.append,
              remove: education.remove,
            }}
            disabled={!isEditable}
          />

          <ProjectsSkillsSection
            control={control}
            errors={errors}
            projects={{
              fields: projects.fields,
              append: projects.append,
              remove: projects.remove,
            }}
            disabled={!isEditable}
          />

          <SeoSection register={register} errors={errors} disabled={!isEditable} />

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6">
            <Button
              disabled={!isEditable || processing}
              type="submit"
              variant="contained"
              color="success"
              startIcon={<Save />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Save changes
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}
