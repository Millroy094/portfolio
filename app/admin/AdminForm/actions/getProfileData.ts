"use server";

import type { Schema } from "@/amplify/data/resource";
import type { ProfileSchemaType } from "../schema";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import outputs from "@/amplify_outputs.json";
import { cookies } from "next/headers";

export async function getProfileData(): Promise<{
    profileId: string | null;
    data: ProfileSchemaType | null;
}> {
    const client = generateServerClientUsingCookies<Schema>({
        config: outputs,
        cookies,
    });

    const list = await client.models.Profile.list({});
    const p = list.data[0];

    if (!p) return { profileId: null, data: null };

    const [roles, badges, exps, edus, projects] = await Promise.all([
        client.models.Role.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Badge.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Experience.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Education.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Project.list({ filter: { profileId: { eq: p.id } } }),
    ]);

    return {
        profileId: p.id,
        data: {
            avatar: p.avatarKey ?? "",
            fullName: p.fullName ?? "",
            punchLine: p.punchLine ?? "",
            linkedIn: p.linkedIn ?? undefined,
            github: p.github ?? undefined,
            stackOverflow: p.stackOverflow ?? undefined,
            resume: p.resume ?? undefined,
            aboutMe: p.aboutMe ?? "",
            seoTitle: p.seoTitle ?? "",
            seoDescription: p.seoDescription ?? "",

            roles: roles.data.map((r) => ({ value: r.value })),
            badges: badges.data.map((b) => ({ value: b.value })),

            experiences: exps.data.map((e) => ({
                organization: e.organization,
                title: e.title,
                year: Number(e.year),
            })),

            education: edus.data.map((e) => ({
                institute: e.institute,
                qualification: e.qualification,
                year: Number(e.year),
            })),

            projects: projects.data.map((p) => ({
                name: p.name,
                description: p.description ?? "",
                url: p.url ?? "",
            })),

            skills: (p.skills ?? []).filter(
                (s): s is string => typeof s === "string"
            ),
        },
    };
}