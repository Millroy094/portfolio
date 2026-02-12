import { cache } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import { Metadata } from "next";
import getWebsiteData from "@/app/home/actions/getWebsiteData";
import { WebsiteDataProvider } from "@/context/WebsiteData";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const getCachedWebsiteData = cache(async () => {
  return await getWebsiteData();
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCachedWebsiteData();

  return {
    title: data.seoTitle,
    description: data.seoDescription,
    keywords: data.roles.join(", "),
    alternates: {
      canonical: `${process.env.PUBLIC_URL}/`,
    },
    openGraph: {
      title: data.seoTitle,
      description: data.seoDescription,
      images: [data.avatarUrl],
      url: process.env.PUBLIC_URL,
      type: "website",
    },
    icons: {
      icon: "/logo.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const data = await getCachedWebsiteData();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: data.fullName,
              jobTitle: data.roles.join(" | "),
              url: process.env.PUBLIC_URL,
              sameAs: [data.github, data.linkedin],
              worksFor: {
                "@type": "Organization",
                name: "Freelance",
              },
            }),
          }}
        />
      </head>
      <Providers>
        <WebsiteDataProvider initialData={data}>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
          </body>
        </WebsiteDataProvider>
      </Providers>
    </html>
  );
}
