"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";

const generateS3UrlFromKey = async (path: string) => {
    const { url } = await getUrl({ path: path });
    return url.toString();
}

export function useProfile() {
    const [profile, setProfile] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const client = generateClient<Schema>({ authMode: "iam" });

                // 1) Get the single profile
                const list = await client.models.Profile.list({});
                const p = list.data[0];
                if (!p) {
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                const [roles, badges, experiences, education, projects] = await Promise.all([
                    client.models.Role.list({ filter: { profileId: { eq: p.id } } }),
                    client.models.Badge.list({ filter: { profileId: { eq: p.id } } }),
                    client.models.Experience.list({ filter: { profileId: { eq: p.id } } }),
                    client.models.Education.list({ filter: { profileId: { eq: p.id } } }),
                    client.models.Project.list({ filter: { profileId: { eq: p.id } } }),
                ]);

                const avatarUrl = p.avatarKey? await generateS3UrlFromKey(p.avatarKey) : null;


                const badgeUrls = await Promise.all(
                    badges.data
                        .filter(Boolean)
                        .map(b => generateS3UrlFromKey(b.value))
                );

                setProfile({
                    ...p,
                    avatarUrl,
                    badgeUrls,
                    roles: roles.data.map(r => r.value),
                    experiences: experiences.data,
                    education: education.data,
                    projects: projects.data,
                });
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return { profile, loading };
}