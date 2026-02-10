"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCategories } from "@/hooks/useCategories";
import { useUpdateProduct } from "@/hooks/useProducts";
import { DUMMY_PRODUCTS } from "@/lib/dummyData";
import CreateAndEditProduct from "@/shared-components/CreateAndEditProduct";
import Loading from "@/shared-components/Loading";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const updateMutation = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Find product from dummy data
  const product = DUMMY_PRODUCTS.find((p) => p.id === id) || null;

  const handleSubmit = (data) => {
    updateMutation.mutate({ id, data });
  };

  if (categoriesLoading) {
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
