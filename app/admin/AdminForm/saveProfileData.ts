"use client";

import { runWithAmplifyServerContext } from "@/services/amplify/amplifyServer";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { ProfileSchemaType } from "@/app/admin/AdminForm/schema";

type ChildModel = "Badge" | "Role" | "Experience" | "Education" | "Project";

type BadgeCreateInput = { value: string };
type RoleCreateInput = { value: string };
type ExperienceCreateInput = {
    organization: string;
    title: string;
    year: string | number;
};
type EducationCreateInput = {
    institute: string;
    qualification: string;
    year: string | number;
};
type ProjectCreateInput = {
    name: string;
    description?: string | null;
    url?: string | null;
};

interface SafeModelClient<CreateInput> {
    list(args: { filter: { profileId: { eq: string } } }): Promise<{
        data: { id: string }[];
    }>;
    delete(args: { id: string }): Promise<unknown>;
    create(args: { profileId: string } & CreateInput): Promise<unknown>;
}

type ProfilePayload = {
    fullName: string;
    punchLine?: string;
    avatarKey?: string;
    linkedIn?: string;
    github?: string;
    stackOverflow?: string;
    resume?: string;
    aboutMe?: string;
    skills: string[];
};

type SafeModels = {
    Badge: SafeModelClient<BadgeCreateInput>;
    Role: SafeModelClient<RoleCreateInput>;
    Experience: SafeModelClient<ExperienceCreateInput>;
    Education: SafeModelClient<EducationCreateInput>;
    Project: SafeModelClient<ProjectCreateInput>;
    Profile: {
        create(args: ProfilePayload): Promise<{ data?: { id: string } }>;
        update(args: { id: string } & ProfilePayload): Promise<unknown>;
    };
};

type SafeClient = {
    models: SafeModels;
};

async function uploadIfFile(prefix: string, value: unknown): Promise<string | undefined> {
    if (typeof File !== "undefined" && value instanceof File) {
        const f = value;
        const path = `${prefix}/${Date.now()}-${f.name}`;
        await uploadData({ path, data: f, options: { contentType: f.type } }).result;
        return path;
    }
    if (typeof value === "string") return value;
    return undefined;
}

async function normalizeAssets(
    prefix: string,
    items: { value: File | string }[] | undefined
): Promise<BadgeCreateInput[]> {
    if (!items?.length) return [];
    const processed = await Promise.all(
        items.map(async (i) => {
            const key = await uploadIfFile(prefix, i.value);
            return key ? { value: key } : null;
        })
    );
    return processed.filter((x): x is { value: string } => x !== null);
}

/**
 * Overloads per model ensure that call sites have concrete types
 * and `.create()` receives the exact payload it needs.
 */
async function replaceChildren(
    client: SafeClient,
    model: "Role",
    profileId: string,
    items: RoleCreateInput[] | undefined
): Promise<void>;
async function replaceChildren(
    client: SafeClient,
    model: "Badge",
    profileId: string,
    items: BadgeCreateInput[] | undefined
): Promise<void>;
async function replaceChildren(
    client: SafeClient,
    model: "Experience",
    profileId: string,
    items: ExperienceCreateInput[] | undefined
): Promise<void>;
async function replaceChildren(
    client: SafeClient,
    model: "Education",
    profileId: string,
    items: EducationCreateInput[] | undefined
): Promise<void>;
async function replaceChildren(
    client: SafeClient,
    model: "Project",
    profileId: string,
    items: ProjectCreateInput[] | undefined
): Promise<void>;

/**
 * Single implementation. We keep `items` as unknown[] in the impl signature,
 * but we narrow and cast inside each case (still no `any`).
 */
async function replaceChildren(
    client: SafeClient,
    model: ChildModel,
    profileId: string,
    items: unknown[] | undefined
): Promise<void> {
    switch (model) {
        case "Role": {
            const m = client.models.Role;
            const existing = await m.list({ filter: { profileId: { eq: profileId } } });
            if (existing.data.length) {
                await Promise.all(existing.data.map((e) => m.delete({ id: e.id })));
            }
            if (!items?.length) return;
            const typed = items as RoleCreateInput[];
            await Promise.all(typed.map((it) => m.create({ profileId, ...it })));
            return;
        }

        case "Badge": {
            const m = client.models.Badge;
            const existing = await m.list({ filter: { profileId: { eq: profileId } } });
            if (existing.data.length) {
                await Promise.all(existing.data.map((e) => m.delete({ id: e.id })));
            }
            if (!items?.length) return;
            const typed = items as BadgeCreateInput[];
            await Promise.all(typed.map((it) => m.create({ profileId, ...it })));
            return;
        }

        case "Experience": {
            const m = client.models.Experience;
            const existing = await m.list({ filter: { profileId: { eq: profileId } } });
            if (existing.data.length) {
                await Promise.all(existing.data.map((e) => m.delete({ id: e.id })));
            }
            if (!items?.length) return;
            const typed = items as ExperienceCreateInput[];
            await Promise.all(typed.map((it) => m.create({ profileId, ...it })));
            return;
        }

        case "Education": {
            const m = client.models.Education;
            const existing = await m.list({ filter: { profileId: { eq: profileId } } });
            if (existing.data.length) {
                await Promise.all(existing.data.map((e) => m.delete({ id: e.id })));
            }
            if (!items?.length) return;
            const typed = items as EducationCreateInput[];
            await Promise.all(typed.map((it) => m.create({ profileId, ...it })));
            return;
        }

        case "Project": {
            const m = client.models.Project;
            const existing = await m.list({ filter: { profileId: { eq: profileId } } });
            if (existing.data.length) {
                await Promise.all(existing.data.map((e) => m.delete({ id: e.id })));
            }
            if (!items?.length) return;
            const typed = items as ProjectCreateInput[];
            await Promise.all(typed.map((it) => m.create({ profileId, ...it })));
            return;
        }
    }
}

export async function saveProfileData(
    formData: ProfileSchemaType,
    existingProfileId?: string|null
) {

            const client = generateClient<Schema>({
                authMode: "userPool", // Browser-side authenticated user
            }) as unknown as SafeClient;

            const avatarKey = await uploadIfFile("avatars", formData.avatar);

            const normalizedBadges = await normalizeAssets("badges", formData.badges);

            const payload: ProfilePayload = {
                fullName: formData.fullName,
                punchLine: formData.punchLine ?? undefined,
                avatarKey,
                linkedIn: formData.linkedIn ?? undefined,
                github: formData.github ?? undefined,
                stackOverflow: formData.stackOverflow ?? undefined,
                resume: formData.resume ?? undefined,
                aboutMe: formData.aboutMe ?? undefined,
                skills: [...(formData.skills ?? [])],
            };

            let profileId: string;

            if (existingProfileId) {
                profileId = existingProfileId;
                await client.models.Profile.update({ id: profileId, ...payload });
            } else {
                const created = await client.models.Profile.create(payload);
                if (!created.data) throw new Error("Failed to create profile");
                profileId = created.data.id;
            }

            await replaceChildren(
                client,
                "Role",
                profileId,
                (formData.roles ?? []).map((r) => ({ value: r.value }))
            );
            await replaceChildren(client, "Badge", profileId, normalizedBadges);
            await replaceChildren(client, "Experience", profileId, formData.experiences ?? []);
            await replaceChildren(client, "Education", profileId, formData.education ?? []);
            await replaceChildren(client, "Project", profileId, formData.projects ?? []);

            return { ok: true, profileId };
}