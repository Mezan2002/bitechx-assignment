import { DUMMY_CATEGORIES } from "@/lib/dummyData";

export const useCategories = (params = {}) => {
  return {
    data: DUMMY_CATEGORIES,
    isLoading: false,
    error: null,
  };
};
