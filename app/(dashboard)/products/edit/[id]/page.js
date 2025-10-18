"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { useUpdateProduct } from "@/hooks/useProducts";
import { productsAPI } from "@/lib/api";
import CreateAndEditProduct from "@/shared-components/CreateAndEditProduct";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const updateMutation = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await productsAPI.getAll({});
      const foundProduct = response.data.find((p) => p.id === id);
      if (!foundProduct) throw new Error("Product not found");
      return foundProduct;
    },
  });

  const handleSubmit = (data) => {
    updateMutation.mutate({ id, data });
  };

  if (productLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <CreateAndEditProduct
      mode="edit"
      initialData={product}
      categories={categories || []}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      error={updateMutation.error}
      productCreatedAt={product.createdAt}
    />
  );
}
