import {
  SiHtml5,
  SiCss,
  SiSass,
  SiMui,
  SiStyledcomponents,
  SiExpress,
  SiTailwindcss,
  SiSnowflake,
  SiApachekafka,
  SiRabbitmq,
  SiHelm,
  SiTerraform,
  SiGithubactions,
  SiWordpress,
  SiDotnet,
  SiStripe,
  SiAuth0,
  SiKeycloak,
  SiWebauthn,
  SiReact,
  SiRedux,
  SiGraphql,
  SiGo,
  SiNodedotjs,
  SiTypescript,
  SiPhp,
  SiLaravel,
  SiJest,
  SiGnubash,
  SiCypress,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiPostgresql,
  SiDocker,
  SiKubernetes,
} from "@icons-pack/react-simple-icons";
import React from "react";
import { FaAws, FaJava } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";

import PlaywrightIcon from "@/components/PlaywrightIcon";

export type SkillId =
  | "html5"
  | "css3"
  | "sass"
  | "react"
  | "mui"
  | "styled-components"
  | "redux"
  | "nodejs"
  | "typescript"
  | "express"
  | "nextjs"
  | "tailwindcss"
  | "graphql"
  | "golang"
  | "java"
  | "php"
  | "laravel"
  | "wordpress"
  | "csharp"
  | "dotnet"
  | "bash"
  | "jest"
  | "cypress"
  | "playwright"
  | "mongodb"
  | "redis"
  | "mysql"
  | "postgresql"
  | "snowflake"
  | "kafka"
  | "rabbitmq"
  | "docker"
  | "kubernetes"
  | "helm"
  | "terraform"
  | "github-actions"
  | "aws"
  | "azure"
  | "stripe"
  | "auth0"
  | "keycloak"
  | "webauthn";

export type Skill = {
  id: SkillId;
  label: string;
  render: () => React.ReactNode;
  group?: "FE" | "BE" | "DB" | "Testing" | "DevOps" | "Identity" | "Payments" | "Messaging" | "Other";
};

const size = 40;

export const skillsRegistry: Record<SkillId, Skill> = {
  html5: {
    id: "html5",
    label: "HTML 5",
    group: "FE",
    render: () => <SiHtml5 size={size} color="#E34F26" />,
  },
  css3: {
    id: "css3",
    label: "CSS 3",
    group: "FE",
    render: () => <SiCss size={size} color="#663399" />,
  },
  sass: {
    id: "sass",
    label: "Sass",
    group: "FE",
    render: () => <SiSass size={size} color="#CC6699" />,
  },
  react: {
    id: "react",
    label: "React.js",
    group: "FE",
    render: () => <SiReact size={size} color="#61DAFB" />,
  },
  mui: {
    id: "mui",
    label: "Material UI",
    group: "FE",
    render: () => <SiMui size={size} color="#007FFF" />,
  },
  "styled-components": {
    id: "styled-components",
    label: "Styled Components",
    group: "FE",
    render: () => <SiStyledcomponents size={size} color="#DB7093" />,
  },
  redux: {
    id: "redux",
    label: "Redux",
    group: "FE",
    render: () => <SiRedux size={size} color="#764ABC" />,
  },
  nodejs: {
    id: "nodejs",
    label: "Node.js",
    group: "BE",
    render: () => <SiNodedotjs size={size} color="#5FA04E" />,
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    group: "FE",
    render: () => <SiTypescript size={size} color="#3178C6" />,
  },
  express: {
    id: "express",
    label: "Express.js",
    group: "BE",
    render: () => <SiExpress size={size} color="#ffffff" />,
  },
  nextjs: {
    id: "nextjs",
    label: "Next.js",
    group: "FE",
    render: () => <RiNextjsFill size={size} color="#ffffff" />,
  },
  tailwindcss: {
    id: "tailwindcss",
    label: "Tailwind CSS",
    group: "FE",
    render: () => <SiTailwindcss size={size} color="#06B6D4" />,
  },
  graphql: {
    id: "graphql",
    label: "GraphQL",
    group: "BE",
    render: () => <SiGraphql size={size} color="#E10098" />,
  },
  golang: {
    id: "golang",
    label: "Golang",
    group: "BE",
    render: () => <SiGo size={size} color="#00ADD8" />,
  },
  java: {
    id: "java",
    label: "Java",
    group: "BE",
    render: () => <FaJava size={size} color="#F89820" />,
  },
  php: {
    id: "php",
    label: "PHP",
    group: "BE",
    render: () => <SiPhp size={size} color="#777BB4" />,
  },
  laravel: {
    id: "laravel",
    label: "Laravel",
    group: "BE",
    render: () => <SiLaravel size={size} color="#FF2D20" />,
  },
  wordpress: {
    id: "wordpress",
    label: "WordPress",
    group: "Other",
    render: () => <SiWordpress size={size} color="#21759B" />,
  },
  csharp: {
    id: "csharp",
    label: "C#",
    group: "BE",
    render: () => <TbBrandCSharp size={size} color="#239120" />,
  },
  dotnet: {
    id: "dotnet",
    label: ".NET",
    group: "BE",
    render: () => <SiDotnet size={size} color="#2088FF" />,
  },
  bash: {
    id: "bash",
    label: "Bash",
    group: "DevOps",
    render: () => <SiGnubash size={size} color="#4EAA25" />,
  },
  jest: {
    id: "jest",
    label: "Jest",
    group: "Testing",
    render: () => <SiJest size={size} color="#C21325" />,
  },
  cypress: {
    id: "cypress",
    label: "Cypress",
    group: "Testing",
    render: () => <SiCypress size={size} color="#69D3A7" />,
  },
  playwright: {
    id: "playwright",
    label: "Playwright",
    group: "Testing",
    render: () => <PlaywrightIcon size={size} />,
  },
  mongodb: {
    id: "mongodb",
    label: "MongoDB",
    group: "DB",
    render: () => <SiMongodb size={size} color="#47A248" />,
  },
  redis: {
    id: "redis",
    label: "Redis",
    group: "DB",
    render: () => <SiRedis size={size} color="#FF4438" />,
  },
  mysql: {
    id: "mysql",
    label: "MySQL",
    group: "DB",
    render: () => <SiMysql size={size} color="#4479A1" />,
  },
  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
    group: "DB",
    render: () => <SiPostgresql size={size} color="#4169E1" />,
  },
  snowflake: {
    id: "snowflake",
    label: "Snowflake",
    group: "DB",
    render: () => <SiSnowflake size={size} color="#29B5E8" />,
  },
  kafka: {
    id: "kafka",
    label: "Apache Kafka",
    group: "Messaging",
    render: () => <SiApachekafka size={size} color="#ffffff" />,
  },
  rabbitmq: {
    id: "rabbitmq",
    label: "RabbitMQ",
    group: "Messaging",
    render: () => <SiRabbitmq size={size} color="#FF6600" />,
  },
  docker: {
    id: "docker",
    label: "Docker",
    group: "DevOps",
    render: () => <SiDocker size={size} color="#2496ED" />,
  },
  kubernetes: {
    id: "kubernetes",
    label: "Kubernetes",
    group: "DevOps",
    render: () => <SiKubernetes size={size} color="#326CE5" />,
  },
  helm: {
    id: "helm",
    label: "Helm",
    group: "DevOps",
    render: () => <SiHelm size={size} color="#0F1689" />,
  },
  terraform: {
    id: "terraform",
    label: "Terraform",
    group: "DevOps",
    render: () => <SiTerraform size={size} color="#844FBA" />,
  },
  "github-actions": {
    id: "github-actions",
    label: "GitHub Actions",
    group: "DevOps",
    render: () => <SiGithubactions size={size} color="#2088FF" />,
  },
  aws: {
    id: "aws",
    label: "AWS",
    group: "DevOps",
    render: () => <FaAws size={size} color="#FF9900" />,
  },
  azure: {
    id: "azure",
    label: "Azure",
    group: "DevOps",
    render: () => <VscAzure size={size} color="#0078D4" />,
  },
  stripe: {
    id: "stripe",
    label: "Stripe",
    group: "Payments",
    render: () => <SiStripe size={size} color="#635BFF" />,
  },
  auth0: {
    id: "auth0",
    label: "Auth0",
    group: "Identity",
    render: () => <SiAuth0 size={size} color="#EB5424" />,
  },
  keycloak: {
    id: "keycloak",
    label: "Keycloak",
    group: "Identity",
    render: () => <SiKeycloak size={size} color="#4D4D4D" />,
  },
  webauthn: {
    id: "webauthn",
    label: "WebAuthn",
    group: "Identity",
    render: () => <SiWebauthn size={size} color="#3423A6" />,
  },
};

export const allSkills: Skill[] = Object.values(skillsRegistry);
export const getSkillById = (id: SkillId) => skillsRegistry[id];
