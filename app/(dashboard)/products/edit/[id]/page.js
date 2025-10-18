"use client";

import ProductForm from "@/components/products/ProductForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { useUpdateProduct } from "@/hooks/useProducts";
import { productsAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage({ params }) {
  const { id } = params;

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      // Since we need to get by ID but API only supports slug, we'll need to fetch all and find
      const response = await productsAPI.getAll({});
      const foundProduct = response.data.find((p) => p.id === id);
      if (!foundProduct) throw new Error("Product not found");
      return foundProduct;
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const updateMutation = useUpdateProduct();

  const handleSubmit = (data) => {
    updateMutation.mutate({ id, data });
  };

  if (productLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      {updateMutation.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {updateMutation.error.response?.data?.message ||
              "Failed to update product"}
          </AlertDescription>
        </Alert>
      )}

      {product && (
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending || categoriesLoading}
          categories={categories || []}
        />
      )}
    </div>
  );
}
