"use client";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/queryClient";
import { setCredentials } from "@/redux/auth/authSlice";
import { store } from "@/redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";

function AuthRehydrator({ children }) {
  const [isRehydrating, setIsRehydrating] = useState(true);

  useEffect(() => {
    // Rehydrate auth from localStorage ONCE
    try {
      const token = localStorage.getItem("auth_token");
      const email = localStorage.getItem("auth_email");

      if (token && email) {
        store.dispatch(setCredentials({ token, email }));
      }
    } catch (error) {
      console.error("Failed to rehydrate auth:", error);
    } finally {
      setIsRehydrating(false);
    }
  }, []); // Empty deps - only run once

  if (isRehydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
}

export function Providers({ children }) {
  // Persist state to localStorage on changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.auth.token) {
        localStorage.setItem("auth_token", state.auth.token);
        localStorage.setItem("auth_email", state.auth.email);
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_email");
      }
    });
    return unsubscribe;
  }, []); // Empty deps - only setup once

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthRehydrator>{children}</AuthRehydrator>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
}
