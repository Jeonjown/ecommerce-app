import { useParams, useNavigate } from "react-router-dom";
import { useGetProductBySlug } from "@/hooks/useGetProductBySlug";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import type { ProductVariantWithOptions } from "@/types/api/products";
import Counter from "@/components/Counter";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetLoggedInUser } from "@/hooks/useGetLoggedInUser";

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProductBySlug(slug!);
  const { mutate } = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantWithOptions | null>(null);

  const { data: user } = useGetLoggedInUser();

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    if (!user) {
      navigate("/login");
      return;
    }
    mutate({
      product_id: selectedVariant.product_id,
      variant_id: selectedVariant.id,
      product_name: data?.product.name,
      name: selectedVariant.name,
      price: +selectedVariant.price,
      image_url: selectedVariant.image_url,
      quantity,
      stock: selectedVariant.stock,
    });
  };

  useEffect(() => {
    if (data?.product?.variants?.length) {
      setSelectedVariant(data.product.variants[0] as ProductVariantWithOptions);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="mb-4 h-6 w-40" />
        <Skeleton className="mb-2 h-8 w-full max-w-md" />
        <Skeleton className="h-48 w-full max-w-md" />
        <Skeleton className="mt-4 h-5 w-3/4" />
      </div>
    );
  }

  if (isError || !data?.product) {
    return (
      <div className="text-muted-foreground p-4">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      <Breadcrumb className="hidden px-8 md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex max-w-6xl flex-col gap-8 md:flex-row md:p-8">
        {/* Image */}
        <div className="w-full flex-shrink-0 md:w-1/2">
          <div className="aspect-square w-full overflow-hidden rounded border">
            <img
              src={selectedVariant?.image_url}
              alt={selectedVariant?.sku}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-6">
            {/* Title + Price */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">{data.product.name}</h1>
              <p className="text-primary text-3xl font-bold">
                ₱ {(Number(selectedVariant?.price) || 0).toFixed(2)}
              </p>
            </div>

            {/* Variants */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Variants:
              </p>
              <div className="flex flex-wrap gap-2">
                {data.product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isOutOfStock = variant.stock === 0;

                  return (
                    <button
                      key={variant.id}
                      onClick={() =>
                        !isOutOfStock &&
                        setSelectedVariant(variant as ProductVariantWithOptions)
                      }
                      disabled={isOutOfStock}
                      className={`rounded border px-3 py-1 text-sm transition ${
                        isSelected
                          ? "border-primary text-primary bg-neutral-100"
                          : ""
                      } ${
                        isOutOfStock
                          ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                          : "border-gray-300 text-gray-700 hover:bg-neutral-100"
                      }`}
                    >
                      {variant.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center">
              <p className="mr-5 text-sm font-medium text-gray-700">
                Quantity:
              </p>
              <Counter quantity={quantity} setQuantity={setQuantity} />
              <div className="flex items-center gap-2">
                <span className="ml-5 text-sm font-medium text-gray-700">
                  Available:
                </span>
                <span className="text-gray-800">{selectedVariant?.stock}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                Description
              </h2>
              <div className="max-h-45 space-y-2 overflow-y-auto pr-2 text-sm leading-relaxed whitespace-pre-line text-gray-700">
                {selectedVariant?.description || "No description available."}
              </div>
            </div>
          </div>

          {/* Add to Cart Button pinned at bottom */}
          <div className="mt-auto pt-4">
            <Button
              className="bg-primary w-full text-white"
              disabled={
                !selectedVariant || quantity > (selectedVariant?.stock ?? 0)
              }
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            {selectedVariant && quantity > selectedVariant.stock && (
              <p className="pt-2 text-sm text-red-600">Insufficient stock.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
