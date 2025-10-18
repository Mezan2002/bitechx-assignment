"use client";

import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import CreateAndEditProduct from "@/shared-components/CreateAndEditProduct";
import Loading from "@/shared-components/Loading";

export default function CreateProductPage() {
  const createMutation = useCreateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  if (categoriesLoading) {
    return <Loading fullPage />;
  }

  return (
    <CreateAndEditProduct
      mode="create"
      categories={categories || []}
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      error={createMutation.error}
    />
  );
}
