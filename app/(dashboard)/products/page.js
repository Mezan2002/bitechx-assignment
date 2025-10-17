"use client";

import ProductCard from "@/components/products/ProductCard";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteProduct,
  useProducts,
  useSearchProducts,
} from "@/hooks/useProducts";
import { BreadCrumb } from "@/shared-components/BreadCrumb";
import DeleteConfirmDialog from "@/shared-components/DeleteConfirmDialog";
import Pagination from "@/shared-components/Pagination";
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
      <div className="py-5 border-b">
        <div className="container mx-auto px-4">
          <BreadCrumb items={breadcrumbs} />
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-primary">
              All Products
            </h2>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-400">All Products</p>
              <p className="text-lg font-medium text-primary leading-4">
                {allProducts?.length || 0} results
              </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="mt-8">
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
