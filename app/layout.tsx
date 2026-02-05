import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: "Millroy Fernandes | Software Engineer Portfolio",
    description:
        "Explore the portfolio of Millroy Fernandes, a software developer specializing in React.JS, Node.JS, Graphql, Express.JS, Docker, Kubernetes, Helm, Terraform, Github Actions, Cypress, Playwright, Jest, MongoDB, Redis, MySQL, Postgresql.",
    keywords:
        "Software Developer, Software Engineer, DevOps Engineer, Portfolio, Projects",
    openGraph: {
        title: "Millroy Fernandes | Software Engineer Portfolio",
        description:
            "Explore the portfolio of Millroy Fernandes, a software engineer specializing in modern web technologies.",
        images: [
            "https://www.portfolio.millroyfernandes.com/profile.jpeg"
        ],
        url: "https://www.portfolio.millroyfernandes.com/",
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
                    url: "https://www.portfolio.millroyfernandes.com",
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
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
