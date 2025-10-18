import { productsAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsAPI.getAll(params).then((res) => res.data),
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsAPI.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
};

export const useSearchProducts = (searchedText) => {
  return useQuery({
    queryKey: ["products", "search", searchedText],
    queryFn: () => productsAPI.search(searchedText).then((res) => res.data),
    enabled: searchedText.length > 0,
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
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Product updated successfully!");
      router.push("/products");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      // Call API (it returns 200 but doesn't actually delete from DB)
      const response = await productsAPI.delete(id);
      return { id, data: response.data };
    },

    // OPTIMISTIC UPDATE - Runs BEFORE the API call
    onMutate: async (productId) => {
      // Cancel any outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot all current product queries for rollback
      const previousQueries = [];

      // Get all queries that start with ["products"]
      queryClient
        .getQueriesData({ queryKey: ["products"] })
        .forEach(([queryKey, data]) => {
          if (data) {
            // Save current state for rollback
            previousQueries.push({ queryKey, data });

            // OPTIMISTICALLY remove the product from this query's data
            queryClient.setQueryData(queryKey, (old) => {
              if (Array.isArray(old)) {
                return old.filter((product) => product.id !== productId);
              }
              return old;
            });
          }
        });

      // Return context for rollback
      return { previousQueries, productId };
    },

    // On success, show toast
    onSuccess: (data, productId) => {
      console.log("Product deleted (optimistically):", productId);
      toast.success("Product deleted successfully!");
    },

    // On error, ROLLBACK the optimistic update
    onError: (error, productId, context) => {
      console.error("Delete failed, rolling back:", error);

      // Restore all previous query data
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(error.response?.data?.message || "Failed to delete product");
    },

    // Note: We DON'T invalidate queries because API doesn't actually delete
    // If we invalidated, the product would come back from the server
  });
};
