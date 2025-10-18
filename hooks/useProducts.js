import { productsAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsAPI.getAll(params).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsAPI.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchProducts = (searchedText) => {
  return useQuery({
    queryKey: ["products", "search", searchedText],
    queryFn: () => productsAPI.search(searchedText).then((res) => res.data),
    enabled: searchedText.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes for search
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => productsAPI.create(data),
    onSuccess: () => {
      // Only invalidate products queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!");
      router.push("/products");
    },
    onError: (error) => {
      if (error?.response?.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create product"
        );
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
      // Only invalidate products queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Product updated successfully!");
      router.push("/products");
    },
    onError: (error) => {
      if (error?.response?.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update product"
        );
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await productsAPI.delete(id);
      return { id, data: response.data };
    },

    // OPTIMISTIC UPDATE
    onMutate: async (productId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot for rollback
      const previousQueries = [];

      queryClient
        .getQueriesData({ queryKey: ["products"] })
        .forEach(([queryKey, data]) => {
          if (data) {
            previousQueries.push({ queryKey, data });

            // Optimistically remove product
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
      // DON'T invalidate - keep optimistic update
    },

    onError: (error, productId, context) => {
      console.error("Delete failed:", error);

      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (error?.response?.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    },
  });
};
