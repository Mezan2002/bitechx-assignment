"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCategories } from "@/hooks/useCategories";
import { useUpdateProduct } from "@/hooks/useProducts";
import { productsAPI } from "@/lib/api";
import CreateAndEditProduct from "@/shared-components/CreateAndEditProduct";
import Loading from "@/shared-components/Loading";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
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
  console.log("🚀 ~ EditProductPage ~ product:", product);

  const handleSubmit = (data) => {
    updateMutation.mutate({ id, data });
  };

  if (productLoading || categoriesLoading) {
    return <Loading fullPage />;
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
      selectedCategory={product?.category}
      categories={categories || []}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      error={updateMutation.error}
      productCreatedAt={product.createdAt}
    />
  );
}
