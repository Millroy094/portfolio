"use client";

import Image from "next/image";
import { getUrl } from "aws-amplify/storage";
import { useEffect, useState } from "react";

export function BadgeDisplay({ value }: { value: File | string }) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        async function resolveBadge() {
            // Case 1 — new File uploaded
            if (value instanceof File) {
                setUrl(URL.createObjectURL(value));
                return;
            }

            if (value  && value.length > 0) {
                const { url } = await getUrl({ path: value });
                setUrl(url.toString());
            }
        }

        resolveBadge();
    }, [value]);

    if (!url) return null;

    return (
        <Image
            alt="badge"
            src={url}
            fill
            className="object-contain p-3"
        />
    );
}