"use client";

import { Hub } from "aws-amplify/utils";
import { useEffect, useState } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  isRefreshing: boolean;
  error: Error | null;
}

/**
 * Hook to monitor authentication state and session stability
 * Useful for detecting when OIDC tokens are being refreshed
 */
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
