"use client";

import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteProduct,
  useProducts,
  useSearchProducts,
} from "@/hooks/useProducts";
import { BreadCrumb } from "@/shared-components/BreadCrumb";
import DeleteConfirmDialog from "@/shared-components/DeleteConfirmDialog";
import Pagination from "@/shared-components/Pagination";
import { Plus } from "lucide-react";
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

  const { data: allProducts, isLoading: isLoadingAll } = useProducts();

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

  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Products" }];

  return (
    <div>
      {/* Header */}
      <div className="py-5">
        <div className="container mx-auto px-4">
          <BreadCrumb items={breadcrumbs} />
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-primary">
              All Products{" "}
              <span className="text-sm font-medium text-primary">
                ({allProducts?.length || 0} results)
              </span>
            </h2>
            <div>
              <Link href="/products/create">
                <Button className="rounded-none">
                  <Plus />
                  Add Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {!isLoading && !isLoadingAll && !isSearching && displayProducts && (
        <>
          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto px-4">
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
            <div className="py-8">
              <Pagination
                currentPage={currentPage}
                totalItems={100}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
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
