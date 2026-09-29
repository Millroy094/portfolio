"use client";

import { Hub } from "aws-amplify/utils";
import { useEffect, useState } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  isRefreshing: boolean;
  error: Error | null;
}

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isRefreshing: false,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      const { event } = payload;

      if (event === "signedIn") {
        setState({
          isAuthenticated: true,
          isRefreshing: false,
          error: null,
        });
      } else if (event === "tokenRefresh") {
        setState((prev) => ({
          ...prev,
          isRefreshing: true,
        }));
      } else if (event === "tokenRefresh_failure") {
        setState((prev) => ({
          ...prev,
          isRefreshing: false,
          error: new Error("Token refresh failed"),
        }));
      } else if (event === "signedOut") {
        setState({
          isAuthenticated: false,
          isRefreshing: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}

export async function waitForTokenRefresh(): Promise<void> {
  const maxWaitTime = 10000;

  return new Promise<void>((resolve) => {
    let unsubscribe: (() => void) | null = null;

    const timeoutId = setTimeout(() => {
      if (unsubscribe) unsubscribe();
      resolve();
    }, maxWaitTime);

    unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "tokenRefresh_failure") {
        clearTimeout(timeoutId);
        if (unsubscribe) unsubscribe();
        resolve();
      }
    });
  });
}
