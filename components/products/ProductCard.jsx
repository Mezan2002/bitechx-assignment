"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, onDelete }) {
  const imgSrc = (product.images?.[0] || "").trim() || "/placeholder.png";

  // Only use remote image if it looks like a full URL
  const isRemote = imgSrc.startsWith("http");
  const finalSrc = isRemote ? imgSrc : "/placeholder.png"; // or handle local paths differently

  return (
    <Card className="hover:shadow-lg transition-shadow rounded-none">
      <CardHeader>
        <Image
          width={400}
          height={400}
          src={finalSrc}
          alt={product?.name || "Product Image"}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <CardTitle className="text-lg line-clamp-1">
          {product?.name || "Product"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-accent-green">
            ${product.price}
          </p>
          <Badge className="bg-accent-tan text-white">
            {product.category?.name}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </Link>
        <Link href={`/products/edit/${product.id}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
