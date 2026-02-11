"use client";

import { uploadData } from "aws-amplify/storage";
import  { type Schema } from "@/amplify/data/resource";
import type { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import {generateClient} from "@aws-amplify/api";

type Client = ReturnType<typeof generateClient<Schema>>
type BaseModel = {
    list: (args: unknown) => Promise<{data: {id: string}[]}>
    delete: (args: {id: string}) => Promise<unknown>
    create: (args: unknown) => Promise<unknown>
}

type ProfilePayload = {
    fullName: string;
    seoTitle: string;
    seoDescription: string;
    punchLine?: string;
    avatarKey?: string;
    linkedIn?: string;
    github?: string;
    stackOverflow?: string;
    resume?: string;
    aboutMe?: string;
    skills: string[];
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
): Promise<{ value: string }[]> {
    if (!items?.length) return [];
    const processed = await Promise.all(
        items.map(async (i) => {
            const key = await uploadIfFile(prefix, i.value);
            return key ? { value: key } : null;
        })
    );
    return processed.filter((x): x is { value: string } => x !== null);
}

async function replaceChildren<K extends Exclude<keyof Client['models'], "Profile">>(
    client: Client,
    model: K,
    profileId: string,
    items: unknown[],
): Promise<void> {

    const m = client.models[model] as BaseModel;

    const existing = await m.list({ filter: { profileId: { eq: profileId } } });
    if (existing.data.length) {
        await Promise.all(existing.data.map((e) => m.delete({ id: e.id })));
    }

    if (!items?.length) {return }

    await Promise.all(items.map((item) => m.create({ ...(item as object), profileId })));

    return;


}

export async function saveProfileData(
    formData: ProfileSchemaType,
    existingProfileId?: string|null
) {

            const client  = generateClient<Schema>()

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
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription
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

            // @ts-expect-error: issue with amplify typescript
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