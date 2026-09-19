# 🚀 Portfolio -- Next.js + AWS Amplify + Terraform

A production-ready **Next.js** personal portfolio deployed on **AWS
Amplify**, backed by:

- 🔐 AWS Cognito (authentication)
- 🗄 DynamoDB via AppSync (data layer)
- 📦 S3 (storage)
- 🏗 Terraform Cloud (Infrastructure as Code)
- 🔄 GitHub Actions with OIDC (secure CI/CD)

Designed to be secure, scalable, and extremely cost-efficient (runs for
pennies per month).

---

# 🏛 Architecture Overview

**Frontend** - Next.js - SEO optimized public page - Protected admin
panel

**Backend** - AWS Cognito - AppSync GraphQL API - DynamoDB - S3

**Infrastructure** - Terraform (Terraform Cloud) - AWS Amplify Hosting -
Route53 (custom domain)

**CI/CD Flow** GitHub Actions (OIDC) → Terraform Cloud → AWS Amplify

No long-lived AWS credentials are stored.

---

# 🌐 Application Structure

The application consists of two main routes:

## 1️⃣ Public Website (`/`)

Fully SEO-optimized and publicly accessible portfolio.

## 2️⃣ Admin (`/admin`)

Protected by AWS Cognito authentication.

From the admin panel you can: - Edit all portfolio content - Show/hide
sections - Update projects and skills - Modify profile information

No redeploy required for content updates.

---

# 🧩 Website Sections

Each section is configurable via the admin dashboard.

### Introduction

- Avatar
- Roles held
- Punchline
- Social links
- Certifications (e.g. AWS badges)

### About Me

Professional summary and background.

### Skills

Interactive globe of technical skills.

### Experience & Education

Highlights professional journey and progression.

### Projects

Personal GitHub projects.

All sections can be toggled on or off.

---

# 🔐 Admin Authentication (External OIDC SSO)

The `/admin` panel is protected by AWS Cognito, federated to an **external
OIDC identity provider** (no native Cognito username/password sign-in is
used). This is configured in `amplify/auth/resource.ts` and driven entirely
by environment variables/secrets - nothing is hardcoded:

| Variable              | Purpose                                          | Source                                    |
| ----------------------- | --------------------------------------------------- | -------------------------------------------- |
| `OIDC_ISSUER_URL`      | Issuer URL of your external IdP                  | `.env` locally / Amplify env var in prod  |
| `OIDC_PROVIDER_NAME`   | Provider name registered in Cognito              | `.env` locally / Amplify env var in prod  |
| `OIDC_CALLBACK_URLS`   | Comma-separated allowed OAuth redirect URLs      | `.env` locally / Amplify env var in prod  |
| `OIDC_LOGOUT_URLS`     | Comma-separated allowed OAuth logout redirect URLs | `.env` locally / Amplify env var in prod |
| `OIDC_CLIENT_ID`       | OIDC app's client ID                             | Amplify Gen2 secret, via Terraform → SSM  |
| `OIDC_CLIENT_SECRET`   | OIDC app's client secret                         | Amplify Gen2 secret, via Terraform → SSM  |

**Locally**, `amplify/auth/resource.ts` reads these from a `.env` file at the
repo root (not `.env.local`, since `npx ampx sandbox` needs it too):

```
OIDC_ISSUER_URL=https://auth.example.com/api/oidc
OIDC_PROVIDER_NAME=Auth
OIDC_CALLBACK_URLS=https://www.example.com/admin,http://localhost:3000/admin
OIDC_LOGOUT_URLS=https://www.example.com/admin,http://localhost:3000/admin
```

`OIDC_CLIENT_ID`/`OIDC_CLIENT_SECRET` are never read from `.env` - they're
Amplify-managed secrets, set once per sandbox with:

```
npx ampx sandbox secret set OIDC_CLIENT_ID
npx ampx sandbox secret set OIDC_CLIENT_SECRET
```

> ⚠️ On your **custom OIDC provider's** side, you also need to register
> Cognito's own redirect URI as an allowed callback URL - not just
> `OIDC_CALLBACK_URLS` above (those are Cognito's callbacks, for your app).
> Find it in the Cognito console under the user pool's app client, or
> construct it as:
> `https://<cognito-domain>.auth.<region>.amazoncognito.com/oauth2/idpresponse`

**In production/CI**, the plain env vars come from the Amplify app's
`environment_variables` (set by Terraform in `infra/app.tf` from the
`oidc_issuer_url`/`oidc_provider_name` Terraform Cloud variables), and the
client ID/secret come from SSM parameters Terraform creates
(`infra/secrets.tf`) at the shared path Amplify's `secret()` resolves for
branch deployments - so no manual Amplify Console step is needed.

The frontend (`app/login/page.tsx`) reads the provider name via
`NEXT_PUBLIC_OIDC_PROVIDER_NAME` (exposed from `OIDC_PROVIDER_NAME` in
`next.config.ts`) and calls `signInWithRedirect({ provider: { custom: name } })`,
which redirects straight to the external IdP - Cognito's own hosted UI is
never shown to end users.

---

# 🔐 Required IAM Setup

You must create **two separate OIDC roles**.

## 1️⃣ GitHub Actions Role

Used only to trigger Amplify builds.

Required permissions:

- amplify:StartJob
- amplify:GetJob
- amplify:ListJobs
- amplify:GetBranch
- amplify:ListBackendEnvironments
- amplifybackend:GetBackend

## 2️⃣ Terraform Cloud Role

Used for provisioning infrastructure.

### Amplify Permissions

- amplify:CreateApp
- amplify:UpdateApp
- amplify:DeleteApp
- amplify:GetApp
- amplify:ListApps
- amplify:CreateBranch
- amplify:UpdateBranch
- amplify:DeleteBranch
- amplify:GetBranch
- amplify:ListBranches
- amplify:CreateDomainAssociation
- amplify:UpdateDomainAssociation
- amplify:DeleteDomainAssociation
- amplify:GetDomainAssociation
- amplify:ListDomainAssociations
- amplify:TagResource
- amplify:UntagResource
- amplify:ListTagsForResource

### IAM Permissions

- iam:CreateRole
- iam:GetRole
- iam:DeleteRole
- iam:AttachRolePolicy
- iam:DetachRolePolicy
- iam:PutRolePolicy
- iam:DeleteRolePolicy
- iam:PassRole
- iam:ListRolePolicies
- iam:ListAttachedRolePolicies
- iam:ListInstanceProfilesForRole
- iam:CreatePolicy
- iam:TagRole
- iam:TagPolicy
- iam:GetPolicy
- iam:DeletePolicy
- iam:GetPolicyVersion
- iam:ListPolicyVersions

### Route53 Permissions

- route53:ListHostedZones
- route53:ListResourceRecordSets
- route53:ListHostedZonesByName

---

# ⚙ Required Terraform Cloud Variables

| Variable Name        | Description                                   | Type      | Example                              |
| --------------------- | ---------------------------------------------- | --------- | ------------------------------------- |
| github_token          | GitHub PAT                                    | Sensitive |                                       |
| domain                | Custom domain name                            | String    | myportfolio.com                      |
| gh_owner              | GitHub org/user                               | String    | yourusername                         |
| gh_repo               | GitHub repository name                        | String    | portfolio                            |
| g_tag                 | Google Analytics ID                           | String    | G-XXXX                               |
| oidc_issuer_url       | Issuer URL of your external OIDC provider     | String    | https://auth.example.com/api/oidc    |
| oidc_provider_name    | Provider name (must match `amplify/auth/resource.ts`) | String | Auth                             |
| oidc_client_id        | OIDC app's client ID                          | Sensitive |                                       |
| oidc_client_secret    | OIDC app's client secret                      | Sensitive |                                       |

`oidc_client_id`/`oidc_client_secret` are written by Terraform to SSM
(`infra/secrets.tf`) at `/amplify/shared/<appId>/OIDC_CLIENT_ID` and
`.../OIDC_CLIENT_SECRET` - the exact path Amplify Gen2's `secret()` resolves
for branch/pipeline deployments, so no manual Amplify Console step is
needed.

---

# 🔑 GitHub Actions Secrets

Configure in your repository settings:

- AWS_REGION
- AWS_ROLE_ARN
- TF_ORG
- TF_API_TOKEN

---

# 🧪 Running Amplify Backend Locally

### Install Amplify CLI

npm install -g @aws-amplify/cli

### Configure CLI

amplify configure

### Launch Sandbox

npx ampx sandbox or npm run dev:backend:build

> **Note:** Once you are done with the backend you can destroy the infrastructure by using `npx ampx sandbox delete` or `npm run dev:backend:destroy` command to avoid incurring any charges.

---

# 💻 Local Next.js Development

### Install dependencies

npm ci

### Create `.env`

```
PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_G_TAG=G-XXXXX
OIDC_ISSUER_URL=https://auth.example.com/api/oidc
OIDC_PROVIDER_NAME=Auth
OIDC_CALLBACK_URLS=https://www.example.com/admin,http://localhost:3000/admin
OIDC_LOGOUT_URLS=https://www.example.com/admin,http://localhost:3000/admin
```

Then set the sandbox-only OIDC client secrets once (see
[Admin Authentication](#-admin-authentication-external-oidc-sso) above):

```
npx ampx sandbox secret set OIDC_CLIENT_ID
npx ampx sandbox secret set OIDC_CLIENT_SECRET
```

### Start development server

npm run dev

Visit http://localhost:3000

---

# 🚀 First-Time Setup After Deployment

1.  Register your admin user with your external OIDC provider
2.  Sign in at /admin via SSO
3.  Add your portfolio content
4.  Configure visibility of sections
5.  Visit / to view your site

---

# 🧑‍💻 If You Plan to Use This Repository

If you fork or reuse this project, you must:

## 1️⃣ Replace the Favicon

Replace all favicon files in the `/public` folder with your own branding
assets.

## 2️⃣ Add Your Own `llms.txt`

Create `/public/llms.txt`:

---

# 🎯 Design Principles

- Infrastructure as Code
- Secure OIDC-based authentication
- No long-lived AWS credentials
- Cost-efficient architecture
- Admin-driven content management
- Clear separation of public and protected routes

---

# 📜 License

MIT License (or update as needed).
