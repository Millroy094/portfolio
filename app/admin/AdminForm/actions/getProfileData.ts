"use server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { withAuthRetry } from "@/services/amplify/authUtils";

import type { ProfileSchemaType } from "../schema";

const getClient = () =>
  generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

export async function getProfileData(): Promise<{
  profileId: string | null;
  data: ProfileSchemaType | null;
}> {
  try {
    const list = await withAuthRetry(() => getClient().models.Profile.list({}), "Fetch profile");

    const p = list.data[0];
    if (!p) return { profileId: null, data: null };

    const [roles, badges, exps, edus, projects] = await Promise.all([
      withAuthRetry(
        () => getClient().models.Role.list({ filter: { profileId: { eq: p.id } } }),
        "Fetch roles",
      ),
      withAuthRetry(
        () => getClient().models.Badge.list({ filter: { profileId: { eq: p.id } } }),
        "Fetch badges",
      ),
      withAuthRetry(
        () => getClient().models.Experience.list({ filter: { profileId: { eq: p.id } } }),
        "Fetch experiences",
      ),
      withAuthRetry(
        () => getClient().models.Education.list({ filter: { profileId: { eq: p.id } } }),
        "Fetch education",
      ),
      withAuthRetry(
        () => getClient().models.Project.list({ filter: { profileId: { eq: p.id } } }),
        "Fetch projects",
      ),
    ]);

    return {
      profileId: p.id,
      data: {
        avatar: p.avatarKey ?? "",
        fullName: p.fullName ?? "",
        punchLine: p.punchLine ?? "",
        linkedIn: p.linkedIn ?? "",
        github: p.github ?? "",
        stackOverflow: p.stackOverflow ?? "",
        medium: p.medium ?? "",
        resume: p.resume ?? "",
        aboutMe: p.aboutMe || "<p></p>",
        seoTitle: p.seoTitle ?? "",
        seoDescription: p.seoDescription ?? "",
        mediumPostCount: p.mediumPostCount ?? 3,
        roles:
          [...roles.data].sort((a, b) => a.order - b.order).map((r) => ({ value: r.value })) ?? [],
        badges: badges.data.map((b) => ({ value: b.value, label: b.label })) ?? [],
        experiences:
          exps.data.map((e) => ({
            organization: e.organization,
            title: e.title,
            year: Number(e.year),
          })) ?? [],
        education:
          edus.data.map((e) => ({
            institute: e.institute,
            qualification: e.qualification,
            year: Number(e.year),
          })) ?? [],
        projects:
          [...projects.data]
            .sort((a, b) => a.order - b.order)
            .map((p) => ({
              name: p.name,
              description: p.description ?? "",
              url: p.url ?? "",
            })) ?? [],
        skills: (p.skills ?? []).filter((s): s is string => typeof s === "string") ?? [],
        visibility: {
          roles: p.showRoles ?? true,
          badges: p.showBadges ?? true,
          aboutMe: p.showAboutMe ?? true,
          experiences: p.showExperiences ?? true,
          education: p.showEducation ?? true,
          projects: p.showProjects ?? true,
          skills: p.showSkills ?? true,
          posts: p.showPosts ?? true,
        },
      },
    };
  } catch (error) {
    console.error("Failed to load profile data", error);
    throw error;
  }
}
