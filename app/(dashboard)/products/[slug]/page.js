"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProduct, useProduct } from "@/hooks/useProducts";
import DeleteConfirmDialog from "@/shared-components/DeleteConfirmDialog";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const deleteMutation = useDeleteProduct();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    deleteMutation.mutate(product.id, {
      onSuccess: () => {
        router.push("/products");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
        <Link href="/products">
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="flex gap-2">
          <Link href={`/products/edit/${product.id}`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl">{product.name}</CardTitle>
            <Badge className="bg-accent-tan text-white text-lg px-4 py-2">
              {product.category?.name}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.images?.map((image, index) => (
              <Image
                key={index}
                src={image}
                width={400}
                height={256}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Price */}
          <div className="border-t pt-4">
            <p className="text-4xl font-bold text-accent-green">
              ${product.price}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Meta Information */}
          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold">Created</p>
              <p>{format(new Date(product.createdAt), "PPP")}</p>
            </div>
            <div>
              <p className="font-semibold">Last Updated</p>
              <p>{format(new Date(product.updatedAt), "PPP")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        productName={product.name}
      />
    </div>
  );
}
