"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, onDelete }) {
  const router = useRouter();
  const imgSrc = (product.images?.[0] || "").trim() || "/placeholder.png";
  const isRemote = imgSrc.startsWith("http");
  const finalSrc = isRemote ? imgSrc : "/placeholder.png";

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/products/edit/${product.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(product);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    router.push(`/products/${product.slug}`);
  };

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden py-0 rounded-none gap-2"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-72 overflow-hidden">
        <Image
          width={400}
          height={400}
          src={finalSrc}
          alt={product?.name || "Product Image"}
          className="w-full h-full object-cover transition-transform duration-300 bg-gray-200"
        />
        {/* Category Badge on Image */}
        <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white border-0 rounded-full">
          {product.category?.name}
        </Badge>
      </div>

      {/* Header with Title and Dropdown */}
      <CardHeader className="px-2 gap-y-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold flex-1 transition-colors line-clamp-1">
            {product?.name || "Product"}
          </h3>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleViewDetails}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4 hover:text-white" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4 hover:text-white" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="!text-red-500 cursor-pointer hover:font-medium"
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="space-y-3 px-2">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-10 mb-0">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="text-2xl font-bold text-accent-green">
              ${product.price}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
