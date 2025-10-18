import { productsAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Helper to check auth
const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth_token");
};

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsAPI.getAll(params).then((res) => res.data),
    enabled: isAuthenticated(), // ✅ Only fetch if authenticated
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsAPI.getBySlug(slug).then((res) => res.data),
    enabled: !!slug && isAuthenticated(), // ✅ Only fetch if authenticated
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchProducts = (searchedText) => {
  return useQuery({
    queryKey: ["products", "search", searchedText],
    queryFn: () => productsAPI.search(searchedText).then((res) => res.data),
    enabled: searchedText.length > 0 && isAuthenticated(), // ✅ Only fetch if authenticated
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => productsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!");
      router.push("/products");
    },
    onError: (error) => {
      const message = error.response?.data?.message;
      if (message?.includes("Authorization")) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error(message || "Failed to create product");
      }
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Product updated successfully!");
      router.push("/products");
    },
    onError: (error) => {
      const message = error.response?.data?.message;
      if (message?.includes("Authorization")) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error(message || "Failed to update product");
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id) => {
      const response = await productsAPI.delete(id);
      return { id, data: response.data };
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousQueries = [];

      queryClient
        .getQueriesData({ queryKey: ["products"] })
        .forEach(([queryKey, data]) => {
          if (data) {
            previousQueries.push({ queryKey, data });

            queryClient.setQueryData(queryKey, (old) => {
              if (Array.isArray(old)) {
                return old.filter((product) => product.id !== productId);
              }
              return old;
            });
          }
        });

      return { previousQueries, productId };
    },

    onSuccess: () => {
      toast.success("Product deleted successfully!");
    },

    onError: (error, productId, context) => {
      console.error("Delete failed:", error);

      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const message = error.response?.data?.message;
      if (message?.includes("Authorization")) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error(message || "Failed to delete product");
      }
    },
  });
};
