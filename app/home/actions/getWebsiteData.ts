"use server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { Nullable } from "@aws-amplify/data-schema";
import { getUrl } from "aws-amplify/storage/server";
import { cookies } from "next/headers";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { runWithAmplifyServerContext } from "@/services/amplify/amplifyServer";

export type ExperienceData = {
  year: Nullable<number>;
  title: string;
  organization: string;
};

export type EducationData = {
  year: Nullable<number>;
  qualification: string;
  institute: string;
};

type ProjectData = {
  url: string;
  description: string;
  name: string;
};

export type BadgesData = {
  url: string;
  label: string;
};

export type WebsiteData = {
  seoTitle: string;
  seoDescription: string;
  fullName: string;
  punchLine: string;
  aboutMe: string;
  github: string;
  linkedin: string;
  stackOverflow: string;
  resume: string;
  roles: string[];
  skills: string[];
  avatarUrl: string;
  badges: BadgesData[];
  experiences: ExperienceData[];
  education: EducationData[];
  projects: ProjectData[];

  visibility: {
    roles: boolean;
    badges: boolean;
    aboutMe: boolean;
    experiences: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
  };
};

const emptyWebsiteData: WebsiteData = {
  seoTitle: "",
  seoDescription: "",
  fullName: "",
  aboutMe: "",
  github: "",
  linkedin: "",
  stackOverflow: "",
  resume: "",
  punchLine: "",
  skills: [],
  avatarUrl: "",
  badges: [],
  roles: [],
  experiences: [],
  education: [],
  projects: [],

  visibility: {
    roles: true,
    badges: true,
    aboutMe: true,
    experiences: true,
    education: true,
    projects: true,
    skills: true,
  },
};

const generateS3UrlFromKey = async (path: string) => {
  const assetUrl = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      const { url } = await getUrl(contextSpec, {
        path,
        options: { expiresIn: 3600 },
      });
      return url;
    },
  });
  return assetUrl.toString();
};

export default async function getWebsiteData(): Promise<WebsiteData> {
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
      authMode: "apiKey",
    });

    const list = await client.models.Profile.list({});
    const p = list.data[0];

    if (!p) return emptyWebsiteData;

    const [rolesRes, badgesRes, expRes, eduRes, projRes] = await Promise.all([
      client.models.Role.list({ filter: { profileId: { eq: p.id } } }),
      client.models.Badge.list({ filter: { profileId: { eq: p.id } } }),
      client.models.Experience.list({ filter: { profileId: { eq: p.id } } }),
      client.models.Education.list({ filter: { profileId: { eq: p.id } } }),
      client.models.Project.list({ filter: { profileId: { eq: p.id } } }),
    ]);

    const visibility = {
      roles: p.showRoles ?? true,
      badges: p.showBadges ?? true,
      aboutMe: p.showAboutMe ?? true,
      experiences: p.showExperiences ?? true,
      education: p.showEducation ?? true,
      projects: p.showProjects ?? true,
      skills: p.showSkills ?? true,
    };

    const avatarUrl = p.avatarKey ? await generateS3UrlFromKey(p.avatarKey) : "";

    const badgeUrlLabelPair = visibility.badges
      ? await Promise.all(
          badgesRes.data.map(async (badge) => {
            const url = await generateS3UrlFromKey(badge.value);
            return { url, label: badge.label };
          }),
        )
      : [];

    return {
      seoTitle: p.seoTitle ?? "",
      seoDescription: p.seoDescription ?? "",
      fullName: p.fullName ?? "",
      punchLine: p.punchLine ?? "",
      aboutMe: visibility.aboutMe ? (p.aboutMe ?? "") : "",
      github: p.github ?? "",
      linkedin: p.linkedIn ?? "",
      stackOverflow: p.stackOverflow ?? "",
      resume: p.resume ?? "",

      roles: visibility.roles ? rolesRes.data.map((r) => r.value) : [],

      skills: visibility.skills
        ? (p?.skills?.filter((s): s is string => typeof s === "string") ?? [])
        : [],

      avatarUrl,

      badges: badgeUrlLabelPair,

      experiences: visibility.experiences
        ? expRes.data.map((e) => ({
            title: e.title,
            organization: e.organization,
            year: e.year,
          }))
        : [],

      education: visibility.education
        ? eduRes.data.map((e) => ({
            qualification: e.qualification,
            institute: e.institute,
            year: e.year,
          }))
        : [],

      projects: visibility.projects
        ? projRes.data.map((e) => ({
            description: e.description ?? "",
            name: e.name,
            url: e.url ?? "",
          }))
        : [],

      visibility,
    };
  } catch (error) {
    console.error("There has been issue retrieving data", error);
    return emptyWebsiteData;
  }
}
