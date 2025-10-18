import { categoriesAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoriesAPI.getAll(params).then((res) => res.data),
  });
};
