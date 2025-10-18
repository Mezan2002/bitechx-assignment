"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { validateProduct } from "@/lib/utils";
import { BreadCrumb } from "@/shared-components/BreadCrumb";
import ImageUpload from "@/shared-components/ImageUpload";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateAndEditProduct({
  mode = "create",
  initialData = null,
  categories = [],
  onSubmit,
  isLoading = false,
  error = null,
  productCreatedAt = null,
}) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    categoryId: "",
    images: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        offerPrice: "",
        categoryId: initialData.category?.id || "",
        images: initialData.images || [],
      });
    }
  }, [initialData]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/products" },
    { label: "Products", href: "/products" },
    { label: isEditMode ? "Edit Product" : "Create Product" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDiscard = () => {
    router.push("/products");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToValidate = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      categoryId: formData.categoryId,
      images: formData.images,
    };

    const validation = validateProduct(dataToValidate);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(dataToValidate);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSubmit}>
        {/* Header Section */}
        <div className="mb-6">
          <BreadCrumb items={breadcrumbItems} />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {isEditMode ? "Edit Product" : "Create New Product"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditMode
                  ? "Update product information"
                  : "Fill in the details to create a new product"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscard}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Product"
                  : "Add Product"}
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b mb-8" />

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error.response?.data?.message ||
                `Failed to ${isEditMode ? "update" : "create"} product`}
            </AlertDescription>
          </Alert>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information Card */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Title */}
                <div>
                  <Label htmlFor="name">
                    Product Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter product title"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Regular Price */}
                  <div>
                    <Label htmlFor="price">
                      Regular Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className={`pl-7 ${
                          errors.price ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Offer Price */}
                  <div>
                    <Label htmlFor="offerPrice">
                      Offer Price{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="offerPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.offerPrice}
                        onChange={(e) =>
                          handleChange("offerPrice", e.target.value)
                        }
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty if no discount
                    </p>
                  </div>
                </div>

                {/* Price Preview */}
                {formData.price && (
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Price Preview:
                    </p>
                    <div className="flex items-center gap-3">
                      {formData.offerPrice && (
                        <span className="text-lg line-through text-muted-foreground">
                          ${formData.price}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-accent-green">
                        ${formData.offerPrice || formData.price}
                      </span>
                      {formData.offerPrice && formData.price && (
                        <span className="bg-accent-red text-white text-xs px-2 py-1 rounded">
                          {Math.round(
                            ((formData.price - formData.offerPrice) /
                              formData.price) *
                              100
                          )}
                          % OFF
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Image Upload */}
            <ImageUpload
              images={formData.images}
              onChange={(images) => handleChange("images", images)}
              error={errors.images}
            />

            {/* Category Selection */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Product Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleChange("categoryId", value)}
                  >
                    <SelectTrigger
                      className={errors.categoryId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            {category.image && (
                              <div className="w-6 h-6 rounded overflow-hidden">
                                <Image
                                  width={24}
                                  height={24}
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm">{errors.categoryId}</p>
                  )}
                </div>

                {formData.categoryId && categories && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      Selected Category:
                    </p>
                    <p className="font-medium">
                      {
                        categories.find((c) => c.id === formData.categoryId)
                          ?.name
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Status Card */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-accent-green">
                      {isEditMode ? "Active" : "Draft"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visibility:</span>
                    <span className="font-medium">Public</span>
                  </div>
                  {isEditMode && productCreatedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium text-xs">
                        {new Date(productCreatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
