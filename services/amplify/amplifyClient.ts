"use client";

import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";

import outputs from "@/amplify_outputs.json";

let configured = false;

export function configureAmplify() {
  if (typeof window === "undefined") return;
  // Only configure once - `Providers` calls this on every render, and
  // re-invoking `Amplify.configure()` resets the Cognito token provider back
  // to its default localStorage-backed storage, racing with the
  // CookieStorage override below.
  if (configured) return;
  configured = true;

  try {
    // Set the CookieStorage adapter *before* `Amplify.configure()`: that call
    // synchronously triggers the pending OAuth-code-exchange listener, which
    // writes tokens into whatever storage is active at that moment. Storing
    // tokens as cookies (instead of the default localStorage) lets
    // server-side code - `proxy.ts` and Server Components using
    // `generateServerClientUsingCookies` - see the same session the client
    // established.
    //
    // `CookieStorage` defaults `secure` to `true`, which makes browsers
    // silently refuse to store the cookie over plain http (e.g. local dev on
    // http://localhost). Only mark it secure when actually served over https.
    cognitoUserPoolsTokenProvider.setKeyValueStorage(
      new CookieStorage({
        sameSite: "lax",
        secure: window.location.protocol === "https:",
      }),
    );
    Amplify.configure(outputs, { ssr: true });
  } catch (err) {
    console.warn("Amplify configuration failed", err);
  }
}
