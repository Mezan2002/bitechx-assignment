"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ImageUpload({ images = [], onChange, error }) {
  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      onChange([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddImage();
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Product Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image URL Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className={error ? "border-red-500" : ""}
            />
            <Button
              type="button"
              onClick={handleAddImage}
              variant="outline"
              disabled={!imageUrl.trim()}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border bg-secondary"
              >
                <Image
                  src={img.startsWith("http") ? img : "/placeholder.png"}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-accent-green text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No images added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add image URLs to preview them here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
