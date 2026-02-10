"use client";

import React, { useRef, useState } from "react";
import { Card, Button } from "@mui/material";
import { Save } from "@mui/icons-material";

import {
    useForm,
    useFieldArray,
    SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ProfileSchema, ProfileSchemaType } from "@/app/admin/schema";

import AvatarSection from "./AvatarSection";
import IdentitySection from "./IdentitySection";
import RolesSection from "./RolesSection";
import BadgesSection from "./BadgesSection";
import AboutMeSection from "./AboutMeSection";
import ExperiencesAndEducationSection from "./ExperiencesAndEducationSection";
import ProjectsSkillsSection from "./ProjectsSkillsSection";

// -----------------------------------------------
// Main Admin Form Component
// -----------------------------------------------

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
            avatar: "",
            experiences: [],
            education: [],
            projects: [],
            skills: []
        }
    });

    // Field Arrays
    const roles = useFieldArray({ control, name: "roles" });
    const badges = useFieldArray({ control, name: "badges" });
    const experiences = useFieldArray({ control, name: "experiences" });
    const education = useFieldArray({ control, name: "education" });
    const projects = useFieldArray({ control, name: "projects" });

    // Avatar / Badge Upload Refs & Cropping
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

    const onSubmit: SubmitHandler<ProfileSchemaType> = (data) => {
        console.log("Form submitted:", data);
    };

    return (
        <Card>
            <form
                className="flex flex-col p-4 sm:p-6 md:p-8 gap-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Hidden file inputs */}
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
                    move={roles.move}
                />

                <BadgesSection
                    errors={errors}
                    fields={badges.fields}
                    append={badges.append}
                    remove={badges.remove}
                    badgeFileInputRef={badgeFileInputRef}
                />

                <AboutMeSection
                    control={control}
                    errors={errors}
                />

                <ExperiencesAndEducationSection
                    control={control}
                    errors={errors}
                    experiences={{
                        fields: experiences.fields,
                        append: experiences.append,
                        remove: experiences.remove,
                        move: experiences.move
                    }}
                    education={{
                        fields: education.fields,
                        append: education.append,
                        remove: education.remove,
                        move: education.move
                    }}
                />

                <ProjectsSkillsSection
                    control={control}
                    errors={errors}
                    projects={{
                        fields: projects.fields,
                        append: projects.append,
                        remove: projects.remove,
                        move: projects.move
                    }}
                />

                {/* Save Button */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6">
                    <Button
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