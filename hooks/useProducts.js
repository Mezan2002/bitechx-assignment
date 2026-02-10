import { DUMMY_PRODUCTS } from "@/lib/dummyData";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useProducts = (params = {}) => {
  const { offset = 0, limit, categoryId } = params;

  let filtered = [...DUMMY_PRODUCTS];

  if (categoryId) {
    filtered = filtered.filter((p) => p.category.id === categoryId);
  }

  const sliced = limit ? filtered.slice(offset, offset + limit) : filtered;

  return {
    data: sliced,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
};

export const useProduct = (slug) => {
  const product = DUMMY_PRODUCTS.find((p) => p.slug === slug) || null;

  return {
    data: product,
    isLoading: false,
    error: null,
  };
};

export const useSearchProducts = (searchedText) => {
  const results =
    searchedText && searchedText.length > 0
      ? DUMMY_PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(searchedText.toLowerCase()),
        )
      : [];

  return {
    data: results,
    isLoading: false,
    error: null,
  };
};

export const useCreateProduct = () => {
  const router = useRouter();

  return {
    mutate: (data) => {
      toast.success("Product created successfully! (dummy)");
      router.push("/products");
    },
    isPending: false,
    error: null,
  };
};

export const useUpdateProduct = () => {
  const router = useRouter();

  return {
    mutate: ({ id, data }) => {
      toast.success("Product updated successfully! (dummy)");
      router.push("/products");
    },
    isPending: false,
    error: null,
  };
};

export const useDeleteProduct = () => {
  return {
    mutate: (id, options) => {
      toast.success("Product deleted successfully! (dummy)");
      if (options?.onSuccess) options.onSuccess();
    },
    isPending: false,
    error: null,
  };
};
