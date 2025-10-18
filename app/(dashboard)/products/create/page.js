"use client";

import ProductForm from "@/components/products/ProductForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  const createMutation = useCreateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

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

      {createMutation.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {createMutation.error.response?.data?.message ||
              "Failed to create product"}
          </AlertDescription>
        </Alert>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || categoriesLoading}
        categories={categories || []}
      />
    </div>
  );
}
