import {
  Code,
  HistoryEdu,
  Savings,
  School,
  SupportAgent,
  Troubleshoot,
  WorkspacePremium,
} from "@mui/icons-material";
import StackIcon from "tech-stack-icons";
import {
  SiApachekafka,
  SiDotnet,
  SiExpress,
  SiGithubactions,
  SiHelm,
  SiTerraform,
} from "@icons-pack/react-simple-icons";

export const introduction = {
  name: "Millroy Fernandes",
  roles: ["Software Engineer", "DevOps Engineer", "Automation QA Engineer"],
  punchLine: "Hungry for knowledge and inspired by change",
  stackOverflowUrl: "https://stackoverflow.com/users/1379158/millroy-fernandes",
  githubUrl: "https://www.github.com/millroy094/",
  linkedinUrl: "https://www.linkedin.com/in/millroy-fernandes-5a2688102/",
  resumeUrl:
    "https://drive.google.com/file/d/1QMmx_J6Lvh2yzW9fUQxaJROLdopT26a2/view?usp=drive_link",
};

export const aboutMe = [
  "I've been a developer for about 6+ years, I've climbed my way up from a customer service advisor to a support engineer to a software engineer and since then I've been on this amazing journey where there is always something to learn. I am well versed with not only the dev world but everything outside and everything in between. Through my whole career my only goal has been to learn, to do the right thing, and be better than my past self.",
  "I've trained myself up as a DevOps and a QA engineer as much as my fullstack experience because I feel as Dev you need to know how important these roles are.",
];

export const skills = [
  <StackIcon key="React.JS" name="reactjs" style={{ width: "40px" }} />,
  <StackIcon
    key="Redux"
    name="redux"
    style={{ width: "40px" }}
    data-label="Redux"
  />,
  <StackIcon key="Node.JS" name="nodejs" style={{ width: "40px" }} />,
  <StackIcon key="Typescript" name="typescript" style={{ width: "40px" }} />,
  <SiExpress key="Express.JS" size={40} color="#ffffff" />,
  <StackIcon key="GraphQL" name="graphql" style={{ width: "40px" }} />,
  <StackIcon key="Golang" name="go" style={{ width: "40px" }} />,
  <StackIcon key="Java" name="java" style={{ width: "40px" }} />,
  <StackIcon key="PHP" name="php" style={{ width: "40px" }} />,
  <StackIcon key="Laravel" name="laravel" style={{ width: "40px" }} />,
  <StackIcon key="C#" name="csharp" style={{ width: "40px" }} />,
  <SiDotnet key=".Net" size={40} color="#2088FF" />,
  <StackIcon key="Jest" name="jest" style={{ width: "40px" }} />,
  <StackIcon key="Cypress.io" name="cypress" style={{ width: "40px" }} />,
  <StackIcon key="Playwright" name="playwright" style={{ width: "40px" }} />,
  <StackIcon key="Mongo DB" name="mongodb" style={{ width: "40px" }} />,
  <StackIcon key="Redis" name="redis" style={{ width: "40px" }} />,
  <StackIcon key="MySQL" name="mysql" style={{ width: "40px" }} />,
  <StackIcon key="PostgreSQL" name="postgresql" style={{ width: "40px" }} />,
  <SiApachekafka key="Apache Kafa" size={40} color="#ffffff" />,
  <StackIcon key="Docker" name="docker" style={{ width: "40px" }} />,
  <StackIcon key="Kubernetes" name="kubernetes" style={{ width: "40px" }} />,
  <SiHelm key="Helm" size={40} color="#0F1689" />,
  <SiTerraform key="Terraform" size={40} color="#844FBA" />,
  <SiGithubactions key="Github Actions" size={40} color="#2088FF" />,
  <StackIcon key="AWS" name="aws" style={{ width: "40px" }} />,
];

export const projects = [
  {
    title: "OpenId Connect Auth Server",
    description:
      "OIDC server with OIDC features it also comes with user management features and additional security features like MFA and Passkey.",
    url: "https://github.com/Millroy094/oauth-server",
  },
  {
    title: "Task Manager",
    description:
      "Exploratory project for Go and its concurrency features. The project is a pub sub service using RabbitMQ for message queuing, and processing different types of tasks",
    url: "https://github.com/Millroy094/task-processor",
  },
  {
    title: "Portfolio",
    description:
      "This webpage is part of this repository and is where I have started showcasing my work and skills.",
    url: "https://github.com/Millroy094/portfolio",
  },
  {
    title: "Keycloak Cluster",
    description:
      "My first go at using terraform, AWS, and github actions to build a CI/CD pipeline. The project comprised of deploying a Keycloak docker container into Amazon ECS.",
    url: "https://github.com/Millroy094/keycloak-cluster-aws-terraform",
  },
  {
    title: "Recipe App",
    description:
      "A simple app to store & manage recipes. This was part of a senior developer interview I took on and was by far the best version they saw.",
    url: "https://github.com/Millroy094/recipe-book",
  },
  {
    title: "Travel Planner",
    description:
      "My first Node.JS project and my entry into the web development world. This is a backend api meshing up weather and google maps data together.",
    url: "https://github.com/Millroy094/Travel-Planner",
  },
  {
    title: "Zoo Simulator",
    description:
      "Again part of another interview application is a Zoo simulator designed with PHP backend and React.Js frontend.",
    url: "https://github.com/Millroy094/zoo-simulator",
  },
  {
    title: "Tanks",
    description:
      "My first ever had with an AI tank, a game was a unity Multiplayer tutorial which I enhanced by having the player to be an AI.",
    url: "https://github.com/Millroy094/Tanks",
  },
];

export const workTimeline = [
  {
    year: 2013,
    title: "Nationwide Building Society",
    subTitle: "Customer Service Advisor",
    Icon: <Savings />,
  },
  {
    year: 2015,
    title: "Ricoh UK",
    subTitle: "Service Desk Analyst",
    Icon: <SupportAgent />,
  },
  {
    year: 2017,
    title: "Integral UK",
    subTitle: "Graduate Data Analyst",
    Icon: <Troubleshoot />,
  },
  {
    year: 2018,
    title: "Guides For Brides",
    subTitle: "Junior Web Developer",
    Icon: <Code />,
  },
  {
    year: 2020,
    title: "Q:Chi",
    subTitle: "Software Engineer",
    Icon: <Code />,
  },
  {
    year: 2023,
    title: "Alcumus",
    subTitle: "Senior Software Developer Team Lead",
    Icon: <Code />,
  },
];

export const educationTimeline = [
  {
    year: 2008,
    title: "St. Anthony's High School Goa India",
    subTitle: "Higher Secondary",
    Icon: <HistoryEdu />,
  },
  {
    year: 2009,
    title: "Fr. Agnel Polytechnic Verna Goa India",
    subTitle: "Diploma in Computer Engineering",
    Icon: <WorkspacePremium />,
  },
  {
    year: 2014,
    title: "New College Swindon UK",
    subTitle: "HND In Computing and Systems Development",
    Icon: <WorkspacePremium />,
  },
  {
    year: 2016,
    title: "Coventry University",
    subTitle: "B.Sc. (Hons) Informatics",
    Icon: <School />,
  },
];
