"use client";

import ProductCard from "@/components/products/ProductCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteProduct,
  useProducts,
  useSearchProducts,
} from "@/hooks/useProducts";
import DeleteConfirmDialog from "@/shared-components/DeleteConfirmDialog";
import Pagination from "@/shared-components/Pagination";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);

  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;

  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data: products,
    isLoading,
    error,
  } = useProducts({
    offset,
    limit: itemsPerPage,
  });

  const { data: searchResults, isLoading: isSearching } =
    useSearchProducts(debouncedSearch);

  const deleteMutation = useDeleteProduct();

  const displayProducts = debouncedSearch ? searchResults : products;
  const showPagination = !debouncedSearch && products;

  const handleDelete = (product) => {
    setDeleteProduct(product);
  };

  const confirmDelete = () => {
    if (deleteProduct) {
      deleteMutation.mutate(deleteProduct.id, {
        onSuccess: () => {
          setDeleteProduct(null);
        },
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary">Products</h1>
        <Link href="/products/create">
          <Button className="bg-accent-green hover:bg-accent-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load products. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {(isLoading || isSearching) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !isSearching && displayProducts && (
        <>
          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {showPagination && products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={100}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
        onConfirm={confirmDelete}
        productName={deleteProduct?.name}
      />
    </div>
  );
}
