"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProduct, useProduct } from "@/hooks/useProducts";
import { BreadCrumb } from "@/shared-components/BreadCrumb";
import DeleteConfirmDialog from "@/shared-components/DeleteConfirmDialog";
import { Edit, Trash } from "lucide-react";
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
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product?.name || "Product" },
  ];

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

  const imgSrc = (product?.images?.[0] || "").trim() || "/placeholder.png";
  const isRemote = imgSrc.startsWith("http");
  const finalSrc = isRemote ? imgSrc : "/placeholder.png";

  return (
    <div className="container mx-auto px-4">
      <div className="py-5">
        <BreadCrumb items={breadcrumb} />
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          <div>
            <Image
              src={finalSrc}
              width={400}
              height={256}
              alt={product?.name}
              className="w-full h-[70vh] object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-primary">
            {product?.name}
          </h2>
          <p className="text-lg text-gray-600">{product?.category?.name}</p>
          <p className="text-xl font-semibold text-primary mt-3 mb-5">
            ${product?.price}
          </p>

          <label className="font-semibold">Description</label>
          <p className="text-lg line-clamp-4 min-h-40">
            {product?.description}
          </p>
          <div className="mb-5">
            <label className="font-semibold">Color</label>
            <div className="flex items-center gap-2 mt-2">
              <div className="size-8 rounded-full bg-red-500" />
              <div className="size-8 rounded-full bg-green-500" />
              <div className="size-8 rounded-full bg-blue-500" />
            </div>
          </div>
          <div className="flex gap-5">
            <Link href={`/products/edit/${product.id}`} className="flex-1">
              <Button className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              className="flex-1 bg-red-500"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        productName={product.name}
      />
    </div>
  );
}
