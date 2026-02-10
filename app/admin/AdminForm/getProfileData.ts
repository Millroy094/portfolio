"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { ProfileSchemaType } from "./schema";


export async function getProfileData(): Promise<{ profileId: string| null, data: ProfileSchemaType | null }> {
    const client = generateClient<Schema>({
        authMode: "userPool", // Browser-side authenticated user
    });

    // GET THE ONLY PROFILE
    const list = await client.models.Profile.list({});
    const p = list.data[0];
    if (!p) return {profileId: null, data: null};

    // Load related models
    const [roles, badges, exps, edus, projects] = await Promise.all([
        client.models.Role.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Badge.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Experience.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Education.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Project.list({ filter: { profileId: { eq: p.id } } }),
    ]);

    // Normalize into ProfileSchemaType shape
    return { profileId: p.id, data:
    {
        avatar: p.avatarKey ?? "",
            fullName
    :
        p.fullName ?? "",
            punchLine
    :
        p.punchLine ?? "",
            linkedIn
    :
        p.linkedIn ?? undefined,
            github
    :
        p.github ?? undefined,
            stackOverflow
    :
        p.stackOverflow ?? undefined,
            resume
    :
        p.resume ?? undefined,
            aboutMe
    :
        p.aboutMe ?? "",

            roles
    :
        roles.data.map(r => ({value: r.value})),
            badges
    :
        badges.data.map(b => ({value: b.value})),

            experiences
    :
        exps.data.map(e => ({
            organization: e.organization,
            title: e.title,
            year: Number(e.year),
        })),

            education
    :
        edus.data.map(e => ({
            institute: e.institute,
            qualification: e.qualification,
            year: Number(e.year),
        })),

            projects
    :
        projects.data.map(p => ({
            name: p.name,
            description: p.description ?? "",
            url: p.url ?? "",
        })),

            skills
    :
        (p.skills ?? []).filter((s): s is string => typeof s === "string"),
    }
};
}