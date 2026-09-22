"use server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { Nullable } from "@aws-amplify/data-schema";
import { getUrl } from "aws-amplify/storage/server";
import { decode } from "he";
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

export type MediumPost = {
  title: string;
  link: string;
  publishedAt: string;
  description: string;
  imageUrl: string;
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
  medium: string;
  resume: string;
  roles: string[];
  skills: string[];
  avatarUrl: string;
  badges: BadgesData[];
  experiences: ExperienceData[];
  education: EducationData[];
  projects: ProjectData[];
  mediumPosts: MediumPost[];

  visibility: {
    roles: boolean;
    badges: boolean;
    aboutMe: boolean;
    experiences: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
    posts: boolean;
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
  medium: "",
  resume: "",
  punchLine: "",
  skills: [],
  avatarUrl: "",
  badges: [],
  roles: [],
  experiences: [],
  education: [],
  projects: [],
  mediumPosts: [],

  visibility: {
    roles: true,
    badges: true,
    aboutMe: true,
    experiences: true,
    education: true,
    projects: true,
    skills: true,
    posts: true,
  },
};

const mockWebsiteData: WebsiteData = {
  seoTitle: "Jane Doe — Software Engineer",
  seoDescription: "Portfolio of Jane Doe, a full-stack software engineer.",
  fullName: "Jane Doe",
  punchLine: "I build fast, reliable, and delightful web experiences.",
  aboutMe:
    "<p>I'm a software engineer with 8+ years of experience building web applications across fintech and e-commerce. I love turning complex problems into simple, elegant solutions.</p><p>Outside of work I contribute to open source and write about frontend architecture.</p>",
  github: "https://github.com/janedoe",
  linkedin: "https://linkedin.com/in/janedoe",
  stackOverflow: "https://stackoverflow.com/users/123456/janedoe",
  medium: "https://medium.com/@janedoe",
  resume: "https://example.com/resume.pdf",
  roles: ["Full-Stack Engineer", "Tech Lead", "Open Source Maintainer"],
  skills: ["typescript", "react", "nodejs", "aws", "graphql"],
  avatarUrl: "/logo.svg",
  badges: [
    { url: "/logo.svg", label: "AWS Certified" },
    { url: "/logo.svg", label: "Top Contributor" },
  ],
  experiences: [
    { year: 2024, title: "Staff Software Engineer", organization: "Acme Corp" },
    { year: 2023, title: "Senior Software Engineer", organization: "Acme Corp" },
    { year: 2021, title: "Software Engineer II", organization: "Acme Corp" },
    { year: 2020, title: "Software Engineer", organization: "Globex Inc" },
    { year: 2018, title: "Software Engineer", organization: "Initech" },
    { year: 2017, title: "Junior Developer", organization: "Initech" },
    { year: 2015, title: "Intern Developer", organization: "Umbrella Labs" },
  ],
  education: [
    { year: 2016, qualification: "MSc Computer Science", institute: "University of Example" },
    { year: 2014, qualification: "BSc Computer Science", institute: "Example State University" },
    { year: 2012, qualification: "A-Levels", institute: "Example College" },
    { year: 2010, qualification: "Foundation Diploma", institute: "Example Sixth Form" },
    { year: 2009, qualification: "GCSEs", institute: "Example High School" },
  ],
  projects: [
    {
      name: "DevBoard",
      description: "A real-time dashboard for tracking developer productivity metrics.",
      url: "https://github.com/janedoe/devboard",
    },
    {
      name: "SnapAPI",
      description: "A lightweight tool for mocking REST APIs during development.",
      url: "https://github.com/janedoe/snapapi",
    },
  ],
  mediumPosts: [
    {
      title: "Scaling React Apps: Lessons Learned",
      link: "https://medium.com/@janedoe/scaling-react-apps",
      publishedAt: new Date().toISOString(),
      description: "A deep dive into patterns that helped us scale our React codebase.",
      imageUrl: "/logo.svg",
    },
    {
      title: "Why We Moved to Serverless",
      link: "https://medium.com/@janedoe/why-serverless",
      publishedAt: new Date().toISOString(),
      description: "Our journey migrating from EC2 to a fully serverless architecture.",
      imageUrl: "/logo.svg",
    },
  ],

  visibility: {
    roles: true,
    badges: true,
    aboutMe: true,
    experiences: true,
    education: true,
    projects: true,
    skills: true,
    posts: true,
  },
};

function extractTagValue(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m?.[1]?.trim() ?? "";
}

function stripHtml(input: string): string {
  return decode(input.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstImageUrl(input: string): string {
  const cleaned = input.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1");
  const match = cleaned.match(/<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
  return match?.[1]?.trim() ?? "";
}

function extractMediaContentUrl(itemXml: string): string {
  const match = itemXml.match(/<media:content[^>]*\surl=["']([^"']+)["'][^>]*>/i);
  return match?.[1]?.trim() ?? "";
}

function mediumFeedUrlFromProfileUrl(profileUrl: string): string | null {
  try {
    const url = new URL(profileUrl);
    if (url.pathname.startsWith("/feed")) return url.toString();
    if (url.hostname === "medium.com" && url.pathname.startsWith("/@")) {
      return `https://medium.com/feed${url.pathname}`;
    }
    if (url.hostname.endsWith(".medium.com")) {
      return `${url.origin}/feed`;
    }
    return null;
  } catch {
    return null;
  }
}

async function getLatestMediumPosts(
  profileUrl: string,
  postCount: number = 3,
): Promise<MediumPost[]> {
  const feedUrl = mediumFeedUrlFromProfileUrl(profileUrl);
  if (!feedUrl) return [];

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

    return items.slice(0, postCount).map((item) => {
      const block = item[1];
      const content = extractTagValue(block, "content:encoded");
      const descriptionHtml = extractTagValue(block, "description");
      const title = stripHtml(extractTagValue(block, "title"));
      const link = extractTagValue(block, "link");
      const publishedAt = extractTagValue(block, "pubDate");
      const description = stripHtml(descriptionHtml).slice(0, 220);
      const imageUrl =
        extractFirstImageUrl(content) ||
        extractFirstImageUrl(descriptionHtml) ||
        extractMediaContentUrl(block);
      return { title, link, publishedAt, description, imageUrl };
    });
  } catch (error) {
    console.error("Failed to fetch Medium posts", error);
    return [];
  }
}

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
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
    return mockWebsiteData;
  }

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
      posts: p.showPosts ?? true,
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
      medium: p.medium ?? "",
      resume: p.resume ?? "",

      roles: visibility.roles
        ? [...rolesRes.data].sort((a, b) => a.order - b.order).map((r) => r.value)
        : [],

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
        ? [...projRes.data]
            .sort((a, b) => a.order - b.order)
            .map((e) => ({
              description: e.description ?? "",
              name: e.name,
              url: e.url ?? "",
            }))
        : [],
      mediumPosts:
        visibility.posts && p.medium
          ? await getLatestMediumPosts(p.medium, p.mediumPostCount ?? 3)
          : [],

      visibility,
    };
  } catch (error) {
    console.error("There has been issue retrieving data", error);
    return emptyWebsiteData;
  }
}
