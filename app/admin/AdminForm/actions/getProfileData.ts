"use server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { withAuthRetry } from "@/services/amplify/authUtils";

import type { ProfileSchemaType } from "../schema";

export async function getProfileData(): Promise<{
  profileId: string | null;
  data: ProfileSchemaType | null;
}> {
  try {
    const list = await withAuthRetry(async () => {
      const client = generateServerClientUsingCookies<Schema>({
        config: outputs,
        cookies,
      });
      return client.models.Profile.list({});
    }, "Fetch profile data");

    const p = list.data[0];

    if (!p) return { profileId: null, data: null };

    const [roles, badges, exps, edus, projects] = await Promise.all([
      withAuthRetry(async () => {
        const client = generateServerClientUsingCookies<Schema>({
          config: outputs,
          cookies,
        });
        return client.models.Role.list({
          filter: { profileId: { eq: p.id } },
        });
      }, "Fetch roles"),
      withAuthRetry(async () => {
        const client = generateServerClientUsingCookies<Schema>({
          config: outputs,
          cookies,
        });
        return client.models.Badge.list({
          filter: { profileId: { eq: p.id } },
        });
      }, "Fetch badges"),
      withAuthRetry(async () => {
        const client = generateServerClientUsingCookies<Schema>({
          config: outputs,
          cookies,
        });
        return client.models.Experience.list({
          filter: { profileId: { eq: p.id } },
        });
      }, "Fetch experiences"),
      withAuthRetry(async () => {
        const client = generateServerClientUsingCookies<Schema>({
          config: outputs,
          cookies,
        });
        return client.models.Education.list({
          filter: { profileId: { eq: p.id } },
        });
      }, "Fetch education"),
      withAuthRetry(async () => {
        const client = generateServerClientUsingCookies<Schema>({
          config: outputs,
          cookies,
        });
        return client.models.Project.list({
          filter: { profileId: { eq: p.id } },
        });
      }, "Fetch projects"),
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
          [...roles.data]
            .sort((a, b) => a.order - b.order)
            .map((r) => ({
              value: r.value,
            })) ?? [],
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

    const isAuthError =
      error instanceof Error &&
      (error.message.includes("Authentication required") ||
        error.message.includes("NoSignedUser") ||
        error.message.includes("NotAuthorized"));

    if (isAuthError) {
      console.warn("Session not ready yet. This may be during OAuth redirect.");
      return { profileId: null, data: null };
    }

    const isRateLimited =
      error instanceof Error &&
      (error.message.includes("TooManyRequests") || error.message.includes("Rate exceeded"));

    if (isRateLimited) {
      console.warn("Rate limited while fetching profile. Retries will help.");
      throw error;
    }

    throw error;
  }
}
