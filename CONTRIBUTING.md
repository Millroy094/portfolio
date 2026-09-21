# Contributing

Thanks for your interest in contributing to this project! This guide covers
how to set up the project locally and the conventions to follow when
submitting changes.

## Getting Started

1. Fork the repository and clone your fork locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env` and fill in the required environment variables for your local
   setup (AWS Amplify config, API keys, etc.).
4. Start the dev server:
   ```bash
   npm run dev
   ```

### Backend (AWS Amplify)

This project uses AWS Amplify for backend resources. To run a local sandbox
backend:

```bash
npm run dev:backend:build
```

To tear it down when you're done:

```bash
npm run dev:backend:destroy
```

## Branching & Commits

- Create a feature branch off `main`: `git checkout -b feature/short-description`.
- Keep commits focused and write clear, descriptive commit messages
  (imperative mood, e.g. "Add contact form validation").
- Rebase on `main` before opening a pull request to keep history clean.

## Code Style

- Run the linter and formatter before committing:
  ```bash
  npm run lint
  npm run format
  ```
- Run the TypeScript type checker:
  ```bash
  npm run tsCheck
  ```
- Follow the existing project structure (`app/`, `components/`, `hooks/`,
  `hoc/`, `services/`, `utils/`, `context/`).
- Prefer functional React components and hooks; avoid introducing class
  components.

## Pull Requests

1. Ensure `npm run lint`, `npm run tsCheck`, and `npm run build` all pass
   locally before opening a PR.
2. Fill out the PR description with a summary of the change and why it's
   needed. Link any related issues.
3. Keep PRs scoped to a single concern where possible — smaller PRs are
   easier to review.
4. A code owner (see `.github/CODEOWNERS`) will review and must approve
   before merging.
5. Squash commits when merging unless there's a reason to preserve
   individual history.

## Reporting Issues

- Use the issue tracker to report bugs or propose features.
- Include steps to reproduce, expected vs. actual behavior, and
  screenshots/logs where relevant.

## Code of Conduct

Be respectful and constructive in all interactions related to this project.
