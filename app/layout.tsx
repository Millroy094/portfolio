import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Providers} from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    metadataBase: new URL("https://www.millroyfernandes.com"),
    alternates: {
        canonical: "/", 
    },
    title: "Millroy Fernandes | Software Engineer Portfolio",
    description: "Explore the portfolio of Millroy Fernandes, a software developer specializing in React.JS, Node.JS, Graphql, Express.JS, Docker, Kubernetes, Helm, Terraform, Github Actions, Cypress, Playwright, Jest, MongoDB, Redis, MySQL, Postgresql.",
    keywords:
        "Software Developer, Software Engineer, DevOps Engineer, Portfolio, Projects",
    openGraph: {
        title: "Millroy Fernandes | Software Engineer Portfolio",
        description: "Explore the portfolio of Millroy Fernandes, a software engineer specializing in modern web technologies.",
        images: ["/profile.jpeg"],
        url: "https://www.millroyfernandes.com/",
        type: "website",
    },
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: "Millroy Fernandes",
                    jobTitle: "Software Engineer",
                    url: "https://www.millroyfernandes.com",
                    sameAs: [
                        "https://www.linkedin.com/in/millroy-fernandes-5a2688102/",
                        "https://github.com/Millroy094",
                    ],
                    worksFor: {
                        "@type": "Organization",
                        name: "Freelance",
                    },
                }),
            }}
        />
    </head>
    <Providers><body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </Providers>
    </html>
  );
}
