"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <Authenticator hideSignUp>
        <RedirectOnAuth />
      </Authenticator>
    </div>
  );
}

function RedirectOnAuth() {
  const router = useRouter();
  const { route } = useAuthenticator((ctx) => [ctx.route]);

  useEffect(() => {
    router.prefetch("/admin");

    if (route === "authenticated") {
      router.replace("/admin");
    }
  }, [route, router]);

  return null;
}
