"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, Button } from "@mui/material";
import { Save } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ProfileSchema, ProfileSchemaType } from "@/app/admin/AdminForm/schema";

import AvatarSection from "./AvatarSection";
import IdentitySection from "./IdentitySection";
import RolesSection from "./RolesSection";
import BadgesSection from "./BadgesSection";
import AboutMeSection from "./AboutMeSection";
import ExperiencesAndEducationSection from "./ExperiencesAndEducationSection";
import ProjectsSkillsSection from "./ProjectsSkillsSection";
import { getProfileData } from "@/app/admin/AdminForm/actions/getProfileData";
import { saveProfileData } from "@/app/admin/AdminForm/actions/saveProfileData";
import Box from "@mui/material/Box";
import { Atom } from "react-loading-indicators";
import SeoSection from "@/app/admin/AdminForm/SeoSection";

export default function AdminForm() {
  const [formId, setFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      roles: [{ value: "" }],
      badges: [],
      avatar: "",
      experiences: [],
      education: [],
      projects: [],
      skills: [],
    },
  });

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

  // Field Arrays
  const roles = useFieldArray({ control, name: "roles" });
  const badges = useFieldArray({ control, name: "badges" });
  const experiences = useFieldArray({ control, name: "experiences" });
  const education = useFieldArray({ control, name: "education" });
  const projects = useFieldArray({ control, name: "projects" });

  // Avatar File Picker
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const badgeFileInputRef = useRef<HTMLInputElement | null>(null);

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const handleAvatarFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (avatarInputRef.current) avatarInputRef.current.value = "";
    if (!file) return;
    setCropFile(file);
    setCropOpen(true);
  };

  const onSubmit: SubmitHandler<ProfileSchemaType> = async (data) => {
    setProcessing(true);
    try {
      const result = await saveProfileData(data, formId);
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
      <form
        className="flex flex-col p-4 sm:p-6 md:p-8 gap-6"
        onSubmit={handleSubmit(onSubmit)}
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
          accept="image/*"
          hidden
          ref={badgeFileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) badges.append({ value: file });
            if (badgeFileInputRef.current) badgeFileInputRef.current.value = "";
          }}
        />

        {/* Sections */}
        <AvatarSection
          control={control}
          cropOpen={cropOpen}
          cropFile={cropFile}
          setCropOpen={setCropOpen}
          avatarInputRef={avatarInputRef}
        />

        <IdentitySection
          register={register}
          control={control}
          errors={errors}
        />

        <RolesSection
          control={control}
          errors={errors}
          fields={roles.fields}
          append={roles.append}
          remove={roles.remove}
        />

        <BadgesSection
          errors={errors}
          fields={badges.fields}
          append={badges.append}
          remove={badges.remove}
          badgeFileInputRef={badgeFileInputRef}
        />

        <AboutMeSection control={control} errors={errors} />

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
        />

        <ProjectsSkillsSection
          control={control}
          errors={errors}
          projects={{
            fields: projects.fields,
            append: projects.append,
            remove: projects.remove,
          }}
        />

        <SeoSection register={register} errors={errors} />

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6">
          <Button
            disabled={processing}
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
    </Card>
  );
}
