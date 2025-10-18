import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const validateProduct = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Product name is required";
  }

  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  }

  if (!data.price) {
    errors.price = "Price is required";
  } else if (isNaN(data.price) || Number(data.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (!data.categoryId) {
    errors.categoryId = "Category is required";
  }

  if (!data.images || data.images.length === 0) {
    errors.images = "At least one image URL is required";
  } else {
    const invalidImages = data.images.filter((img) => {
      try {
        new URL(img);
        return false;
      } catch {
        return true;
      }
    });
    if (invalidImages.length > 0) {
      errors.images = "All image URLs must be valid";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
