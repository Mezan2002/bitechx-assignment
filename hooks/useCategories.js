import { categoriesAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth_token");
};

export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoriesAPI.getAll(params).then((res) => res.data),
    enabled: isAuthenticated(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};
