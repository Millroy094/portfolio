"use client";

import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

import { configureAmplify } from "@/services/amplify/amplifyClient";

export function Providers({ children }: { children: React.ReactNode }) {
  configureAmplify();

  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
