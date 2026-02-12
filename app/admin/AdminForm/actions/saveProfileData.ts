"use server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import type { ProfileSchemaType } from "@/app/admin/AdminForm/schema";

type Client = ReturnType<typeof generateServerClientUsingCookies<Schema>>;
type BaseModel = {
  list: (args: unknown) => Promise<{ data: { id: string }[] }>;
  delete: (args: { id: string }) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
};

type Assets = { avatarKey?: string; badgeKeys?: string[] };

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

async function replaceChildren<K extends Exclude<keyof Client["models"], "Profile">>(
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

  if (!items?.length) {
    return;
  }

  await Promise.all(items.map((item) => m.create({ ...(item as object), profileId })));

  return;
}

export async function saveProfileData(
  formData: ProfileSchemaType,
  existingProfileId?: string | null,
  assets?: Assets,
) {
  const client = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  const payload: ProfilePayload = {
    fullName: formData.fullName,
    punchLine: formData.punchLine ?? undefined,
    avatarKey: assets?.avatarKey,
    linkedIn: formData.linkedIn ?? undefined,
    github: formData.github ?? undefined,
    stackOverflow: formData.stackOverflow ?? undefined,
    resume: formData.resume ?? undefined,
    aboutMe: formData.aboutMe ?? undefined,
    skills: [...(formData.skills ?? [])],
    seoTitle: formData.seoTitle,
    seoDescription: formData.seoDescription,
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

  // @ts-expect-error: issue with amplify TypeScript
  await replaceChildren(
    client,
    "Role",
    profileId,
    (formData.roles ?? []).map((r) => ({ value: r.value })),
  );
  await replaceChildren(
    client,
    "Badge",
    profileId,
    (assets?.badgeKeys ?? []).map((badgeKey) => ({ value: badgeKey })),
  );
  await replaceChildren(client, "Experience", profileId, formData.experiences ?? []);
  await replaceChildren(client, "Education", profileId, formData.education ?? []);
  await replaceChildren(client, "Project", profileId, formData.projects ?? []);

  return { ok: true, profileId };
}
