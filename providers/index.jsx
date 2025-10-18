"use client";

import { queryClient } from "@/lib/queryClient";
import { setCredentials } from "@/redux/auth/authSlice";
import { store } from "@/redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Provider } from "react-redux";

export function Providers({ children }) {
  useEffect(() => {
    // Rehydrate auth from localStorage
    const persistedState = localStorage.getItem("persist:root");
    if (persistedState) {
      try {
        const parsedState = JSON.parse(persistedState);
        const authState = JSON.parse(parsedState.auth || "{}");
        if (authState.token) {
          store.dispatch(
            setCredentials({
              token: authState.token,
              email: authState.email,
            })
          );
        }
      } catch (error) {
        console.error("Failed to rehydrate state:", error);
      }
    }
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem(
        "persist:root",
        JSON.stringify({
          auth: JSON.stringify(state.auth),
        })
      );
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
