"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import CreateAndEditProduct from "@/shared-components/CreateAndEditProduct";

export default function CreateProductPage() {
  const createMutation = useCreateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-96" />
      </div>
    );
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
