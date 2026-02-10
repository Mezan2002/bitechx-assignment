"use client";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/queryClient";
import { setCredentials } from "@/redux/auth/authSlice";
import { store } from "@/redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Provider } from "react-redux";

function AuthRehydrator({ children }) {
  useEffect(() => {
    // Auto-inject dummy credentials for design preview
    store.dispatch(
      setCredentials({
        token: "dummy-token-for-design-preview",
        email: "demo@bitechx.com",
      }),
    );

    try {
      localStorage.setItem("auth_token", "dummy-token-for-design-preview");
      localStorage.setItem("auth_email", "demo@bitechx.com");
    } catch (error) {
      console.error("Failed to set dummy auth:", error);
    }
  }, []);

  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthRehydrator>{children}</AuthRehydrator>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
}
