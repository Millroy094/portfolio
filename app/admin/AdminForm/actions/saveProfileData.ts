"use server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import type { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { withAuthRetry } from "@/services/amplify/authUtils";

type Client = ReturnType<typeof generateServerClientUsingCookies<Schema>>;
type BaseModel = {
  list: (args: unknown) => Promise<{ data: { id: string }[] }>;
  delete: (args: { id: string }) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
};

type Assets = { avatarKey?: string; badgeKeyLabels?: { key: string; label: string }[] };

type ProfilePayload = {
  fullName: string;
  seoTitle: string;
  seoDescription: string;
  punchLine?: string;
  avatarKey: string;
  linkedIn?: string;
  github?: string;
  stackOverflow?: string;
  medium?: string;
  resume?: string;
  aboutMe?: string;
  skills: string[];
  mediumPostCount: number;
  showRoles: boolean;
  showBadges: boolean;
  showAboutMe: boolean;
  showExperiences: boolean;
  showEducation: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showPosts: boolean;
};

const getClient = () =>
  generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

async function replaceChildren<K extends Exclude<keyof Client["models"], "Profile">>(
  client: Client,
  model: K,
  profileId: string,
  items: unknown[],
): Promise<void> {
  const m = client.models[model] as BaseModel;
  const existing = await withAuthRetry(
    () => m.list({ filter: { profileId: { eq: profileId } } }),
    `Fetch ${model}`,
  );

  if (existing.data.length) {
    await withAuthRetry(
      () => Promise.all(existing.data.map((e) => m.delete({ id: e.id }))),
      `Delete ${model}`,
    );
  }

  if (items?.length) {
    await withAuthRetry(
      () => Promise.all(items.map((item) => m.create({ ...(item as object), profileId }))),
      `Create ${model}`,
    );
  }
}

export async function saveProfileData(
  formData: ProfileSchemaType,
  existingProfileId?: string | null,
  assets?: Assets,
) {
  if (!assets?.avatarKey) throw new Error("avatarKey is required");

  const client = getClient();
  const payload: ProfilePayload = {
    fullName: formData.fullName,
    punchLine: formData.punchLine ?? undefined,
    avatarKey: assets.avatarKey,
    linkedIn: formData.linkedIn ?? undefined,
    github: formData.github ?? undefined,
    stackOverflow: formData.stackOverflow ?? undefined,
    medium: formData.medium ?? undefined,
    resume: formData.resume ?? undefined,
    aboutMe: formData.aboutMe ?? undefined,
    skills: [...(formData.skills ?? [])],
    mediumPostCount: formData.mediumPostCount ?? 3,
    seoTitle: formData.seoTitle,
    seoDescription: formData.seoDescription,
    showRoles: formData.visibility?.roles ?? true,
    showBadges: formData.visibility?.badges ?? true,
    showAboutMe: formData.visibility?.aboutMe ?? true,
    showExperiences: formData.visibility?.experiences ?? true,
    showEducation: formData.visibility?.education ?? true,
    showProjects: formData.visibility?.projects ?? true,
    showSkills: formData.visibility?.skills ?? true,
    showPosts: formData.visibility?.posts ?? true,
  };

  let profileId: string;

  if (existingProfileId) {
    profileId = existingProfileId;
    await withAuthRetry(
      () => client.models.Profile.update({ id: profileId, ...payload }),
      "Update profile",
    );
  } else {
    const created = await withAuthRetry(
      () => client.models.Profile.create(payload),
      "Create profile",
    );
    if (!created.data) throw new Error("Failed to create profile");
    profileId = created.data.id;
  }

  // @ts-expect-error Amplify TS quirky
  await replaceChildren(
    client,
    "Role",
    profileId,
    (formData.roles ?? []).map((r, i) => ({ value: r.value, order: i })),
  );

  await replaceChildren(
    client,
    "Badge",
    profileId,
    (assets?.badgeKeyLabels ?? []).map((b) => ({ value: b.key, label: b.label })),
  );

  await replaceChildren(client, "Experience", profileId, formData.experiences ?? []);
  await replaceChildren(client, "Education", profileId, formData.education ?? []);
  await replaceChildren(
    client,
    "Project",
    profileId,
    (formData.projects ?? []).map((p, i) => ({ ...p, order: i })),
  );

  return { ok: true, profileId };
}
