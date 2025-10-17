import { useDebounce } from "@/hooks/useDebounce";
import { useSearchProducts } from "@/hooks/useProducts";
import AppDrawer from "@/shared-components/AppDrawer";
import Loading from "@/shared-components/Loading";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: searchResults, isLoading: isSearching } =
    useSearchProducts(debouncedSearch);

  const handleDrawerChange = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <AppDrawer
      trigger={
        <p className="cursor-pointer inline-block">
          <Search size={25} className="text-gray-700" />
        </p>
      }
      open={isDrawerOpen}
      onOpenChange={() => handleDrawerChange()}
      variant="minimal"
    >
      <div className="h-[70vh]">
        <div className="py-4 flex items-center justify-center gap-2.5">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:outline-none leading-0 w-11/12 text-3xl font-medium text-center placeholder:text-gray-600 text-gray-800"
            placeholder="Search products by name..."
          />
        </div>
        {isSearching ? (
          <div className="mt-10">
            <Loading />
          </div>
        ) : (
          <div>
            {searchResults?.length > 0 ? (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  className="py-2.5 px-4 border-b border-gray-200"
                >
                  <p className="text-lg font-medium text-gray-800">
                    {product.name}
                  </p>
                </div>
              ))
            ) : (
              <div>
                {searchQuery ? (
                  <p className="text-sm font-semibold text-center mt-5">
                    No products found.
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-center mt-5">
                    Start typing to see products you are looking for.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppDrawer>
  );
};

export default SearchDrawer;
