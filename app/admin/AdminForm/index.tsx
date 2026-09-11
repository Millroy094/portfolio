"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Lock, Save } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadFileToS3 } from "@/services/amplify/storage/uploadFileToS3";

import AboutMeSection from "./AboutMeSection";
import AvatarSection from "./AvatarSection";
import BadgesSection from "./BadgesSection";
import ExperiencesAndEducationSection from "./ExperiencesAndEducationSection";
import IdentitySection from "./IdentitySection";
import ProjectsSkillsSection from "./ProjectsSkillsSection";
import RolesSection from "./RolesSection";
import WritingSection from "./WritingSection";

type AdminFormProps = { data: ProfileSchemaType | null; profileId: string | null };

export default function AdminForm(props: AdminFormProps) {
  const { data, profileId } = props;
  const [formId, setFormId] = useState<string | null>(profileId);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const methods = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: data ?? {
      roles: [],
      badges: [],
      avatar: "",
      aboutMe: "<p></p>",
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
        posts: true,
      },
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, dirtyFields },
    reset,
  } = methods;

  async function loadData() {
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
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        await loadData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roles = useFieldArray({ control, name: "roles" });
  const badges = useFieldArray({ control, name: "badges" });
  const experiences = useFieldArray({ control, name: "experiences" });
  const education = useFieldArray({ control, name: "education" });
  const projects = useFieldArray({ control, name: "projects" });

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const badgeFileInputRef = useRef<HTMLInputElement | null>(null);

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const hasChanges = useMemo(
    () => isDirty && Object.keys(dirtyFields).length > 0,
    [isDirty, dirtyFields],
  );

  const handleAvatarFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (avatarInputRef.current) avatarInputRef.current.value = "";
    if (!file) return;
    setCropFile(file);
    setCropOpen(true);
  };

  const uploadAssets = async (data: ProfileSchemaType) => {
    let avatarKey: string | undefined;

    try {
      avatarKey = await uploadFileToS3("avatars", data.avatar);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar. Please try again.", {
        theme: "colored",
      });
      throw error;
    }

    if (!data.badges?.length) {
      return { badgeKeyLabels: [], avatarKey };
    }

    let uploads: { key: string; label: string }[];
    try {
      uploads = await Promise.all(
        data.badges.map(async (i) => {
          const key = await uploadFileToS3("badges", i.value);
          if (!key) {
            throw new Error(`Failed to upload badge: ${i.label || "Unnamed badge"}`);
          }
          return { key, label: i.label };
        }),
      );
    } catch (error) {
      console.error("Failed to upload badges:", error);
      toast.error("Failed to upload one or more badges. Please try again.", {
        theme: "colored",
      });
      throw error;
    }
    return { badgeKeyLabels: uploads, avatarKey };
  };
  const handleBadgeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png") {
      toast.error("Only PNG files are allowed.", {
        theme: "colored",
      });
      if (badgeFileInputRef.current) {
        badgeFileInputRef.current.value = "";
      }
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(img.src);
      toast.error("Failed to load image. Please try again.", { theme: "colored" });
      if (badgeFileInputRef.current) {
        badgeFileInputRef.current.value = "";
      }
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      const { width, height } = img;

      if (width !== height) {
        toast.error("Image must be 1:1 aspect ratio (square).", {
          theme: "colored",
        });
        URL.revokeObjectURL(img.src);
        if (badgeFileInputRef.current) {
          badgeFileInputRef.current.value = "";
        }
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Failed to process image.", { theme: "colored" });
        URL.revokeObjectURL(img.src);
        if (badgeFileInputRef.current) {
          badgeFileInputRef.current.value = "";
        }
        return;
      }

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
        URL.revokeObjectURL(img.src);
        if (badgeFileInputRef.current) {
          badgeFileInputRef.current.value = "";
        }
        return;
      }

      badges.append({ value: file, label: "" });
      URL.revokeObjectURL(img.src);
      if (badgeFileInputRef.current) {
        badgeFileInputRef.current.value = "";
      }
      toast.success("Badge added successfully!", { theme: "colored" });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      toast.error("Failed to load image.", { theme: "colored" });
      URL.revokeObjectURL(img.src);
      if (badgeFileInputRef.current) {
        badgeFileInputRef.current.value = "";
      }
    };
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
      const serializableData: ProfileSchemaType = {
        avatar: assets.avatarKey ?? (typeof data.avatar === "string" ? data.avatar : undefined),
        fullName: data.fullName,
        punchLine: data.punchLine,
        linkedIn: data.linkedIn,
        github: data.github,
        stackOverflow: data.stackOverflow,
        medium: data.medium,
        resume: data.resume,
        aboutMe: data.aboutMe,
        roles: (data.roles ?? []).map((r) => ({ value: r.value })),
        badges: (assets.badgeKeyLabels ?? []).map(({ key, label }) => ({ value: key, label })),
        experiences: data.experiences ?? [],
        education: data.education ?? [],
        projects: data.projects ?? [],
        skills: [...(data.skills ?? [])],
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        visibility: {
          roles: data.visibility?.roles ?? true,
          badges: data.visibility?.badges ?? true,
          aboutMe: data.visibility?.aboutMe ?? true,
          experiences: data.visibility?.experiences ?? true,
          education: data.visibility?.education ?? true,
          projects: data.visibility?.projects ?? true,
          skills: data.visibility?.skills ?? true,
          posts: data.visibility?.posts ?? true,
        },
        mediumPostCount: data.mediumPostCount ?? 3,
      };
      const result = await saveProfileData(serializableData, formId, assets);
      const { profileId } = result;
      if (profileId && formId !== profileId) {
        setFormId(profileId);
      }
      await loadData();
      toast.success("Successfully saved profile", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("There was an error while saving profile", {
        theme: "colored",
      });
    }
    setProcessing(false);
    setIsEditable(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Atom color="#32cd32" size="large" text="" textColor="loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <Card className="p-0 flex-1">
        <div className="border-b border-(--admin-border) bg-(--admin-surface-muted) px-6 py-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-(--admin-text)">Profile</h1>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isEditable
                    ? "border border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300"
                    : "border border-(--admin-border-strong) bg-(--admin-surface-muted) text-(--admin-text-muted)"
                }`}
              >
                {isEditable ? "EDIT MODE" : "VIEW ONLY"}
              </div>
            </div>
            <p
              className={`text-sm ${isEditable ? "text-amber-900 dark:text-amber-500" : "text-(--admin-text-muted)"}`}
            >
              {isEditable ? "Make changes and save when ready." : "Click Edit to make changes."}
            </p>
          </div>
        </div>
        <FormProvider {...methods}>
          <form
            className="flex flex-col p-6 sm:p-8 md:p-10 gap-6"
            onSubmit={handleSubmit(onSubmit, onInvalid)}
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
              accept="image/png"
              hidden
              ref={badgeFileInputRef}
              onChange={handleBadgeFile}
            />

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

            <WritingSection
              register={register}
              control={control}
              errors={errors}
              disabled={!isEditable}
            />

            <SeoSection register={register} errors={errors} disabled={!isEditable} />
          </form>
        </FormProvider>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-(--admin-drawer-border) bg-(--admin-drawer-bg) shadow-2xl">
        <div className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            {hasChanges && (
              <Alert variant="warning" className="m-0 text-xs sm:text-sm w-full sm:w-auto">
                You have unsaved changes
              </Alert>
            )}

            {!hasChanges && <div className="hidden sm:block" />}

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsEditable((prev) => !prev)}
                disabled={hasChanges}
                className="gap-2 flex-1 sm:flex-initial h-10"
              >
                {isEditable ? <Lock className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                {isEditable ? "Lock" : "Edit"}
              </Button>

              <Button
                disabled={!isEditable || processing}
                type="submit"
                onClick={handleSubmit(onSubmit, onInvalid)}
                className="gap-2 flex-1 sm:flex-initial h-10"
              >
                {processing ? (
                  <>
                    <span className="inline-block animate-spin">◌</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-40 sm:h-24" />
    </div>
  );
}
