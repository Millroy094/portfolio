# Portfolio

A **Next.js** personal portfolio hosted on **AWS Amplify** (Cognito authentication, S3 storage, DynamoDB data via AppSync). Designed to run for pennies a month, with deployments automated through GitHub Actions (OIDC) → Terraform Cloud → AWS Amplify.

The app consists of two pages:
1. Website: The root page which is publicly available and has all the SEO optimization. 
2. Admin: `/admin` page where you can make all the edits to your content and is protected by Cognito sign in
---

## Required IAM Permissions

You need **two separate OIDC roles**:

### 1. GitHub Actions Role

Allow these actions:

- `amplify:StartJob`
- `amplify:GetJob`
- `amplify:ListJobs`
- `amplify:GetBranch`
- `amplify:ListBackendEnvironments`
- `amplifybackend:GetBackend`

---

### 2. Terraform Cloud Role

Allow these actions:

- **Amplify:**
  - `amplify:CreateApp`, `amplify:UpdateApp`, `amplify:DeleteApp`, `amplify:GetApp`, `amplify:ListApps`
  - `amplify:CreateBranch`, `amplify:UpdateBranch`, `amplify:DeleteBranch`, `amplify:GetBranch`, `amplify:ListBranches`
  - `amplify:CreateDomainAssociation`, `amplify:UpdateDomainAssociation`, `amplify:DeleteDomainAssociation`, `amplify:GetDomainAssociation`, `amplify:ListDomainAssociations`
  - `amplify:TagResource`, `amplify:UntagResource`, `amplify:ListTagsForResource`
- **IAM:**
  - `iam:CreateRole`, `iam:GetRole`, `iam:DeleteRole`, `iam:AttachRolePolicy`, `iam:DetachRolePolicy`
  - `iam:PutRolePolicy`, `iam:DeleteRolePolicy`, `iam:PassRole`, `iam:ListRolePolicies`, `iam:ListAttachedRolePolicies`, `iam:ListInstanceProfilesForRole`
  - `iam:CreatePolicy`, `iam:TagRole`, `iam:TagPolicy`, `iam:GetPolicy`, `iam:DeletePolicy`, `iam:GetPolicyVersion`, `iam:ListPolicyVersions`
- **Route53:**
  - `route53:ListHostedZones`, `route53:ListResourceRecordSets`, `route53:ListHostedZonesByName`

---

## Required Terraform Cloud Variables

Set these variables in your [Terraform Cloud workspace](https://app.terraform.io/):

| Variable Name  | Description            | Type      | Example           |
|----------------|------------------------| --------- |-------------------|
| `github_token` | GitHub PAT             | Sensitive |                   |
| `domain`       | Custom domain name     | String    | `myportfolio.com` |
| `gh_owner`     | GitHub org/user        | String    | `Millroy094`      |
| `gh_repo`      | GitHub repository name | String    | `portfolio`       | 
| `g_tag`        | Google Tag Manager ID  | String    | `G-XXXX`          |
---

## GitHub Actions Variables / Secrets

- `AWS_REGION` (e.g., `eu-west-2`)
- `AWS_ROLE_ARN` (OIDC role ARN for GitHub Actions)
- `TF_ORG` (Terraform Cloud organization)
- `TF_API_TOKEN` (Terraform Cloud API token, secret)

---

## Running Amplify Backend Locally

You can run and test the Amplify backend locally as follows:

1. **Install the Amplify CLI**

   ```sh
   npm install -g @aws-amplify/cli
   ```

2. **Configure the CLI**

   ```sh
   amplify configure
   ```

   _Follow the prompts to set up AWS credentials._

3. **Launch the Amplify Visual Sandbox**
   ```sh
   npx ampx sandbox
   ```
   _Use this to experiment and prototype with the Amplify backend locally._

---

## Local Next.js Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set the only required local environment variable for development:**

   In a `.env.local` file (or in your shell):

   ```
   PUBLIC_URL=http://localhost:3000
   NEXT_PUBLIC_G_TAG=G-XXXXX
   ```

3. **Run the local development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Getting started

Once the website is up and running you be required to create a user on AWS Cognito which will serve as your entry point to the admin page (`/admin`). On the admin add all the data you need to see on the webpage and head over to the website.