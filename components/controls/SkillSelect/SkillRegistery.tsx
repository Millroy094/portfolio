import React from "react";
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
  SiWebauthn
} from "@icons-pack/react-simple-icons";
import StackIcon from "tech-stack-icons";

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
  // optional metadata for grouping/filtering
  group?:
    | "FE"
    | "BE"
    | "DB"
    | "DevOps"
    | "Identity"
    | "Payments"
    | "Messaging"
    | "Other";
};

const size = 40;

export const skillsRegistry: Record<SkillId, Skill> = {
  html5: {
    id: "html5",
    label: "HTML 5",
    group: "FE",
    render: () => <SiHtml5 size={size} color="#E34F26" />
  },
  css3: {
    id: "css3",
    label: "CSS 3",
    group: "FE",
    render: () => <SiCss size={size} color="#663399" />
  },
  sass: {
    id: "sass",
    label: "Sass",
    group: "FE",
    render: () => <SiSass size={size} color="#CC6699" />
  },
  react: {
    id: "react",
    label: "React.js",
    group: "FE",
    render: () => <StackIcon name="react" style={{ width: size }} />
  },
  mui: {
    id: "mui",
    label: "Material UI",
    group: "FE",
    render: () => <SiMui size={size} color="#007FFF" />
  },
  "styled-components": {
    id: "styled-components",
    label: "Styled Components",
    group: "FE",
    render: () => <SiStyledcomponents size={size} color="#DB7093" />
  },
  redux: {
    id: "redux",
    label: "Redux",
    group: "FE",
    render: () => <StackIcon name="redux" style={{ width: size }} />
  },
  nodejs: {
    id: "nodejs",
    label: "Node.js",
    group: "BE",
    render: () => <StackIcon name="nodejs" style={{ width: size }} />
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    group: "FE",
    render: () => <StackIcon name="typescript" style={{ width: size }} />
  },
  express: {
    id: "express",
    label: "Express.js",
    group: "BE",
    render: () => <SiExpress size={size} color="#ffffff" />
  },
  nextjs: {
    id: "nextjs",
    label: "Next.js",
    group: "FE",
    render: () => <StackIcon name="nextjs2" style={{ width: size }} />
  },
  tailwindcss: {
    id: "tailwindcss",
    label: "Tailwind CSS",
    group: "FE",
    render: () => <SiTailwindcss size={size} color="#06B6D4" />
  },
  graphql: {
    id: "graphql",
    label: "GraphQL",
    group: "BE",
    render: () => <StackIcon name="graphql" style={{ width: size }} />
  },
  golang: {
    id: "golang",
    label: "Golang",
    group: "BE",
    render: () => <StackIcon name="go" style={{ width: size }} />
  },
  java: {
    id: "java",
    label: "Java",
    group: "BE",
    render: () => <StackIcon name="java" style={{ width: size }} />
  },
  php: {
    id: "php",
    label: "PHP",
    group: "BE",
    render: () => <StackIcon name="php" style={{ width: size }} />
  },
  laravel: {
    id: "laravel",
    label: "Laravel",
    group: "BE",
    render: () => <StackIcon name="laravel" style={{ width: size }} />
  },
  wordpress: {
    id: "wordpress",
    label: "WordPress",
    group: "Other",
    render: () => <SiWordpress size={size} color="#21759B" />
  },
  csharp: {
    id: "csharp",
    label: "C#",
    group: "BE",
    render: () => <StackIcon name="csharp" style={{ width: size }} />
  },
  dotnet: {
    id: "dotnet",
    label: ".NET",
    group: "BE",
    render: () => <SiDotnet size={size} color="#2088FF" />
  },
  bash: {
    id: "bash",
    label: "Bash",
    group: "Other",
    render: () => <StackIcon name="bash" style={{ width: size }} />
  },
  jest: {
    id: "jest",
    label: "Jest",
    group: "FE",
    render: () => <StackIcon name="jest" style={{ width: size }} />
  },
  cypress: {
    id: "cypress",
    label: "Cypress",
    group: "FE",
    render: () => <StackIcon name="cypress" style={{ width: size }} />
  },
  playwright: {
    id: "playwright",
    label: "Playwright",
    group: "FE",
    render: () => <StackIcon name="playwright" style={{ width: size }} />
  },
  mongodb: {
    id: "mongodb",
    label: "MongoDB",
    group: "DB",
    render: () => <StackIcon name="mongodb" style={{ width: size }} />
  },
  redis: {
    id: "redis",
    label: "Redis",
    group: "DB",
    render: () => <StackIcon name="redis" style={{ width: size }} />
  },
  mysql: {
    id: "mysql",
    label: "MySQL",
    group: "DB",
    render: () => <StackIcon name="mysql" style={{ width: size }} />
  },
  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
    group: "DB",
    render: () => <StackIcon name="postgresql" style={{ width: size }} />
  },
  snowflake: {
    id: "snowflake",
    label: "Snowflake",
    group: "DB",
    render: () => <SiSnowflake size={size} color="#29B5E8" />
  },
  kafka: {
    id: "kafka",
    label: "Apache Kafka",
    group: "Messaging",
    render: () => <SiApachekafka size={size} color="#ffffff" />
  },
  rabbitmq: {
    id: "rabbitmq",
    label: "RabbitMQ",
    group: "Messaging",
    render: () => <SiRabbitmq size={size} color="#FF6600" />
  },
  docker: {
    id: "docker",
    label: "Docker",
    group: "DevOps",
    render: () => <StackIcon name="docker" style={{ width: size }} />
  },
  kubernetes: {
    id: "kubernetes",
    label: "Kubernetes",
    group: "DevOps",
    render: () => <StackIcon name="kubernetes" style={{ width: size }} />
  },
  helm: {
    id: "helm",
    label: "Helm",
    group: "DevOps",
    render: () => <SiHelm size={size} color="#0F1689" />
  },
  terraform: {
    id: "terraform",
    label: "Terraform",
    group: "DevOps",
    render: () => <SiTerraform size={size} color="#844FBA" />
  },
  "github-actions": {
    id: "github-actions",
    label: "GitHub Actions",
    group: "DevOps",
    render: () => <SiGithubactions size={size} color="#2088FF" />
  },
  aws: {
    id: "aws",
    label: "AWS",
    group: "DevOps",
    render: () => <StackIcon name="aws" style={{ width: size }} />
  },
  azure: {
    id: "azure",
    label: "Azure",
    group: "DevOps",
    render: () => <StackIcon name="azure" style={{ width: size }} />
  },
  stripe: {
    id: "stripe",
    label: "Stripe",
    group: "Payments",
    render: () => <SiStripe size={size} color="#635BFF" />
  },
  auth0: {
    id: "auth0",
    label: "Auth0",
    group: "Identity",
    render: () => <SiAuth0 size={size} color="#EB5424" />
  },
  keycloak: {
    id: "keycloak",
    label: "Keycloak",
    group: "Identity",
    render: () => <SiKeycloak size={size} color="#4D4D4D" />
  },
  webauthn: {
    id: "webauthn",
    label: "WebAuthn",
    group: "Identity",
    render: () => <SiWebauthn size={size} color="#3423A6" />
  }
};

export const allSkills: Skill[] = Object.values(skillsRegistry);
export const getSkillById = (id: SkillId) => skillsRegistry[id];
