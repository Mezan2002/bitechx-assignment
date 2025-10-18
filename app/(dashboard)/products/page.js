"use client";

import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteProduct,
  useProducts,
  useSearchProducts,
} from "@/hooks/useProducts";
import { BreadCrumb } from "@/shared-components/BreadCrumb";
import DeleteConfirmDialog from "@/shared-components/DeleteConfirmDialog";
import { ErrorCard } from "@/shared-components/ErrorCard";
import Pagination from "@/shared-components/Pagination";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch products with optional category filter
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useProducts({
    offset,
    limit: itemsPerPage,
    ...(categoryId && { categoryId }),
  });

  const { data: allProducts, isLoading: isLoadingAll } = useProducts({
    ...(categoryId && { categoryId }),
  });

  const { data: searchResults, isLoading: isSearching } =
    useSearchProducts(debouncedSearch);

  const { data: categories } = useCategories();
  const deleteMutation = useDeleteProduct();

  const displayProducts = debouncedSearch ? searchResults : products;
  const showPagination = !debouncedSearch && products;

  // Get current category details
  const currentCategory = categories?.find((cat) => cat.id === categoryId);

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

  const handleClearFilter = () => {
    router.push("/products");
    setCurrentPage(1);
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(currentCategory ? [{ label: currentCategory.name }] : []),
  ];

  // Handle rate limit error
  const isRateLimitError = error?.response?.status === 429;

  return (
    <div>
      {/* Header */}
      <div className="py-5">
        <div className="container mx-auto px-4">
          <BreadCrumb items={breadcrumbs} />
          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <div className="relative">
                  <h2 className="text-3xl font-semibold text-primary">
                    {currentCategory ? currentCategory.name : "All Products"}
                  </h2>
                  {currentCategory && (
                    <button
                      onClick={handleClearFilter}
                      className="absolute -top-2 -right-1 cursor-pointer flex items-center bg-primary/10 hover:bg-primary/20 hover:pr-1 rounded-full group transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex-shrink-0 rounded-full p-0.5">
                        <X className="size-3 text-primary" />
                      </div>

                      <span className="text-xs font-medium text-primary whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden">
                        Clear filter
                      </span>
                    </button>
                  )}
                </div>

                <span className="text-sm font-medium text-primary">
                  ({allProducts?.length || 0} results)
                </span>
              </div>

              {/* Category Filter Badge */}
              {/* {currentCategory && (
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-primary text-white px-3 py-1">
                <span className="mr-2">{currentCategory.name}</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleClearFilter}
              >
                <X className="w-3 h-3 mr-1" />
                Clear filter
              </Button>
            </div>
          )} */}
            </div>
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

      {/* Error State - Rate Limit */}
      {error && isRateLimitError && (
        <div className="container mx-auto px-4 mb-6">
          <ErrorCard
            variant="alert"
            type="warning"
            title="Rate Limit Exceeded"
            message="You've made too many requests. Please wait a moment before trying again."
            onRetry={() => {
              setTimeout(() => {
                refetch();
              }, 2000);
            }}
          />
        </div>
      )}

      {/* Error State - Other Errors */}
      {error && !isRateLimitError && (
        <ErrorCard
          variant="full"
          type="server"
          title="Oops! Something went wrong"
          message="We're having trouble loading the products"
          onRetry={() => refetch()}
          onGoHome={() => router.push("/")}
        />
      )}

      {/* Products Grid */}
      {!error &&
        !isLoading &&
        !isLoadingAll &&
        !isSearching &&
        displayProducts && (
          <>
            {displayProducts.length === 0 ? (
              <div className="container mx-auto px-4">
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">
                    {searchQuery
                      ? "No products found matching your search"
                      : categoryId
                      ? `No products found in ${currentCategory?.name} category`
                      : "No products available"}
                  </p>
                  {(searchQuery || categoryId) && (
                    <div className="flex gap-2 justify-center">
                      {searchQuery && (
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      )}
                      {categoryId && (
                        <Button variant="outline" onClick={handleClearFilter}>
                          View All Products
                        </Button>
                      )}
                    </div>
                  )}
                </div>
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
                  totalItems={allProducts?.length || 0}
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
