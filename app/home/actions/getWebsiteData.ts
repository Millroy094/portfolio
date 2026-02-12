"use server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { getUrl } from "aws-amplify/storage/server";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";
import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@/services/amplify/amplifyServer";
import { Nullable } from "@aws-amplify/data-schema";

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
  skills: string[] | null;
  avatarUrl: string;
  badgeUrls: string[];
  experiences: ExperienceData[] | null;
  education: EducationData[] | null;
  projects: ProjectData[] | null;
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
  badgeUrls: [],
  roles: [],
  experiences: [],
  education: [],
  projects: [],
};

const generateS3UrlFromKey = async (path: string) => {
  const assetUrl = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      const { url } = await getUrl(contextSpec, {
        path,
        options: { useAccelerateEndpoint: true, expiresIn: 3600 },
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
    if (!p) {
      return emptyWebsiteData;
    }

    const [roles, badges, experiences, education, projects] = await Promise.all(
      [
        client.models.Role.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Badge.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Experience.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Education.list({ filter: { profileId: { eq: p.id } } }),
        client.models.Project.list({ filter: { profileId: { eq: p.id } } }),
      ],
    );

    const avatarUrl = p.avatarKey
      ? await generateS3UrlFromKey(p.avatarKey)
      : null;

    const badgeUrls = await Promise.all(
      badges.data.filter(Boolean).map((b) => generateS3UrlFromKey(b.value)),
    );

    return {
      seoTitle: p.seoTitle ?? emptyWebsiteData.seoTitle,
      seoDescription: p.seoDescription ?? emptyWebsiteData.seoDescription,
      fullName: p.fullName ?? emptyWebsiteData.fullName,
      aboutMe: p.aboutMe ?? emptyWebsiteData.aboutMe,
      github: p.github ?? emptyWebsiteData.github,
      linkedin: p.linkedIn ?? emptyWebsiteData.linkedin,
      stackOverflow: p.stackOverflow ?? emptyWebsiteData.stackOverflow,
      resume: p.resume ?? emptyWebsiteData.resume,
      punchLine: p.punchLine ?? emptyWebsiteData.punchLine,
      skills:
        p?.skills?.map((skill) => skill ?? "").filter(Boolean) ??
        emptyWebsiteData.skills,
      avatarUrl: avatarUrl ?? emptyWebsiteData.avatarUrl,
      badgeUrls: badgeUrls ?? emptyWebsiteData.badgeUrls,
      roles: roles.data.map((r) => r.value) ?? emptyWebsiteData.roles,
      experiences:
        experiences.data.map((e) => ({
          title: e.title,
          organization: e.organization,
          year: e.year,
        })) ?? emptyWebsiteData.experiences,
      education:
        education.data.map((e) => ({
          qualification: e.qualification,
          institute: e.institute,
          year: e.year,
        })) ?? emptyWebsiteData.education,
      projects:
        projects.data.map((e) => ({
          description: e.description ?? "",
          name: e.name,
          url: e.url ?? "",
        })) ?? emptyWebsiteData.projects,
    };
  } catch (error) {
    console.error(error);
    return emptyWebsiteData;
  }
}
