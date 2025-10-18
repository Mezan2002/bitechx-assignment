import { QueryClient } from "@tanstack/react-query";

// Helper to check if user is authenticated
const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth_token");
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: (failureCount, error) => {
        // Don't retry if no auth token
        if (!isAuthenticated()) return false;

        // Don't retry on 400, 401, 404, 429
        const status = error?.response?.status;
        if ([400, 401, 404, 429].includes(status)) return false;

        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: isAuthenticated(),
    },
    mutations: {
      retry: false,
    },
  },
});
