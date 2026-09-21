# Security Policy

## Supported Versions

This project is a personal portfolio site deployed continuously from the
`main` branch — there are no maintained release branches or version lines.
Security fixes are applied only to the latest code on `main`.

| Version         | Supported          |
| ---------------- | ------------------ |
| `main` (latest)  | :white_check_mark: |
| Older commits/tags | :x:               |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
privately rather than opening a public issue.

- **Preferred:** Open a
  [private security advisory](https://github.com/Millroy094/portfolio/security/advisories/new)
  via GitHub's "Report a vulnerability" feature.
- **Alternative:** Contact the repository owner ([@Millroy094](https://github.com/Millroy094))
  directly through GitHub.

Please include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce, including any proof-of-concept code.
- The affected file(s), endpoint(s), or configuration.

### What to Expect

- You'll receive an acknowledgement within **5 business days**.
- We'll investigate and aim to provide an initial assessment (accepted,
  declined, or needs more info) within **10 business days**.
- If accepted, a fix will be prioritized and released as soon as
  reasonably possible; you'll be credited (if desired) once the fix ships.
- If declined, we'll explain the reasoning (e.g. not exploitable, out of
  scope, expected behavior).

Please do not publicly disclose the issue until it has been resolved.

## Scope

This policy covers the application code in this repository (Next.js
frontend, AWS Amplify backend configuration, and infrastructure code under
`infra/`). It does not cover third-party dependencies — please report those
issues directly to the upstream maintainers.
