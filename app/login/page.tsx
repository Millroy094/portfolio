"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (signedIn) {
      router.replace("/admin");
    }
  }, [signedIn, router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <Authenticator hideSignUp>
        {({ user }) => {
          if (user && !signedIn) {
            setSignedIn(true);
          }

          return <></>;
        }}
      </Authenticator>
    </div>
  );
}
