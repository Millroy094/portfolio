import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { secret } from "@aws-amplify/backend";
import { defineAuth } from "@aws-amplify/backend-auth";

// Amplify's pipeline injects env vars directly, but `ampx sandbox` (local
// dev) doesn't load `.env` on its own, so parse it ourselves - resolved
// relative to this file since `ampx sandbox`'s cwd isn't the repo root.
const envPath = fileURLToPath(new URL("../../.env", import.meta.url));
try {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const match = /^([\w.-]+)=(.*)$/.exec(line.trim());
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2];
    }
  }
} catch {
  // .env not present - vars are expected to already be set
}

const issuerUrl = process.env.OIDC_ISSUER_URL;
if (!issuerUrl) {
  throw new Error("OIDC_ISSUER_URL environment variable is required");
}

const providerName = process.env.OIDC_PROVIDER_NAME ?? "Auth";
const callbackUrls = process.env.OIDC_CALLBACK_URLS?.split(",") ?? ["http://localhost:3000/admin"];
const logoutUrls = process.env.OIDC_LOGOUT_URLS?.split(",") ?? ["http://localhost:3000/admin"];

export const auth = defineAuth({
  loginWith: {
    // Amplify requires at least one of email/phone even when the app only
    // ever signs in via externalProviders - it's never actually used.
    email: true,

    externalProviders: {
      oidc: [
        {
          name: providerName,
          clientId: secret("OIDC_CLIENT_ID"),
          clientSecret: secret("OIDC_CLIENT_SECRET"),
          issuerUrl,
          // "email" scope + attributeMapping are both required for Cognito
          // to receive and populate the federated user's email attribute.
          scopes: ["openid", "email", "profile"],
          attributeMapping: {
            email: "email",
          },
        },
      ],
      logoutUrls,
      callbackUrls,
    },
  },
});
