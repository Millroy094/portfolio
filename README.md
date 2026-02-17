# 🚀 Portfolio -- Next.js + AWS Amplify + Terraform

A production-ready **Next.js** personal portfolio deployed on **AWS
Amplify**, backed by:

-   🔐 AWS Cognito (authentication)
-   🗄 DynamoDB via AppSync (data layer)
-   📦 S3 (storage)
-   🏗 Terraform Cloud (Infrastructure as Code)
-   🔄 GitHub Actions with OIDC (secure CI/CD)

Designed to be secure, scalable, and extremely cost-efficient (runs for
pennies per month).

------------------------------------------------------------------------

# 🏛 Architecture Overview

**Frontend** - Next.js - SEO optimized public page - Protected admin
panel

**Backend** - AWS Cognito - AppSync GraphQL API - DynamoDB - S3

**Infrastructure** - Terraform (Terraform Cloud) - AWS Amplify Hosting -
Route53 (custom domain)

**CI/CD Flow** GitHub Actions (OIDC) → Terraform Cloud → AWS Amplify

No long-lived AWS credentials are stored.

------------------------------------------------------------------------

# 🌐 Application Structure

The application consists of two main routes:

## 1️⃣ Public Website (`/`)

Fully SEO-optimized and publicly accessible portfolio.

## 2️⃣ Admin (`/admin`)

Protected by AWS Cognito authentication.

From the admin panel you can: - Edit all portfolio content - Show/hide
sections - Update projects and skills - Modify profile information

No redeploy required for content updates.

------------------------------------------------------------------------

# 🧩 Website Sections

Each section is configurable via the admin dashboard.

### Introduction

-   Avatar
-   Roles held
-   Punchline
-   Social links
-   Certifications (e.g. AWS badges)

### About Me

Professional summary and background.

### Skills

Interactive globe of technical skills.

### Experience & Education

Highlights professional journey and progression.

### Projects

Personal GitHub projects.

All sections can be toggled on or off.

------------------------------------------------------------------------

# 🔐 Required IAM Setup

You must create **two separate OIDC roles**.

## 1️⃣ GitHub Actions Role

Used only to trigger Amplify builds.

Required permissions:

-   amplify:StartJob
-   amplify:GetJob
-   amplify:ListJobs
-   amplify:GetBranch
-   amplify:ListBackendEnvironments
-   amplifybackend:GetBackend

## 2️⃣ Terraform Cloud Role

Used for provisioning infrastructure.

### Amplify Permissions

-   amplify:CreateApp
-   amplify:UpdateApp
-   amplify:DeleteApp
-   amplify:GetApp
-   amplify:ListApps
-   amplify:CreateBranch
-   amplify:UpdateBranch
-   amplify:DeleteBranch
-   amplify:GetBranch
-   amplify:ListBranches
-   amplify:CreateDomainAssociation
-   amplify:UpdateDomainAssociation
-   amplify:DeleteDomainAssociation
-   amplify:GetDomainAssociation
-   amplify:ListDomainAssociations
-   amplify:TagResource
-   amplify:UntagResource
-   amplify:ListTagsForResource

### IAM Permissions

-   iam:CreateRole
-   iam:GetRole
-   iam:DeleteRole
-   iam:AttachRolePolicy
-   iam:DetachRolePolicy
-   iam:PutRolePolicy
-   iam:DeleteRolePolicy
-   iam:PassRole
-   iam:ListRolePolicies
-   iam:ListAttachedRolePolicies
-   iam:ListInstanceProfilesForRole
-   iam:CreatePolicy
-   iam:TagRole
-   iam:TagPolicy
-   iam:GetPolicy
-   iam:DeletePolicy
-   iam:GetPolicyVersion
-   iam:ListPolicyVersions

### Route53 Permissions

-   route53:ListHostedZones
-   route53:ListResourceRecordSets
-   route53:ListHostedZonesByName

------------------------------------------------------------------------

# ⚙ Required Terraform Cloud Variables

  Variable Name   Description              Type        Example
  --------------- ------------------------ ----------- -----------------
  github_token    GitHub PAT               Sensitive   
  domain          Custom domain name       String      myportfolio.com
  gh_owner        GitHub org/user          String      yourusername
  gh_repo         GitHub repository name   String      portfolio
  g_tag           Google Analytics ID      String      G-XXXX

------------------------------------------------------------------------

# 🔑 GitHub Actions Secrets

Configure in your repository settings:

-   AWS_REGION
-   AWS_ROLE_ARN
-   TF_ORG
-   TF_API_TOKEN

------------------------------------------------------------------------

# 🧪 Running Amplify Backend Locally

### Install Amplify CLI

npm install -g @aws-amplify/cli

### Configure CLI

amplify configure

### Launch Sandbox

npx ampx sandbox

------------------------------------------------------------------------

# 💻 Local Next.js Development

### Install dependencies

npm install

### Create `.env.local`

PUBLIC_URL=http://localhost:3000 NEXT_PUBLIC_G\_TAG=G-XXXXX

### Start development server

npm run dev

Visit http://localhost:3000

------------------------------------------------------------------------

# 🚀 First-Time Setup After Deployment

1.  Create a user in AWS Cognito
2.  Sign in at /admin
3.  Add your portfolio content
4.  Configure visibility of sections
5.  Visit / to view your site

------------------------------------------------------------------------

# 🧑‍💻 If You Plan to Use This Repository

If you fork or reuse this project, you must:

## 1️⃣ Replace the Favicon

Replace all favicon files in the `/public` folder with your own branding
assets.

## 2️⃣ Add Your Own `llm.txt`

Create `/public/llm.txt`:

------------------------------------------------------------------------

# 🎯 Design Principles

-   Infrastructure as Code
-   Secure OIDC-based authentication
-   No long-lived AWS credentials
-   Cost-efficient architecture
-   Admin-driven content management
-   Clear separation of public and protected routes

------------------------------------------------------------------------

# 📜 License

MIT License (or update as needed).
