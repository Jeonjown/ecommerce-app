import { type ProductWithCategory } from "@/types/api/products";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLowestPrice } from "@/utils/getLowestPrice";
import { Link } from "react-router-dom";

export const ProductCard = ({ product }: { product: ProductWithCategory }) => {
  const firstVariant = product.variants[0];

  if (!firstVariant) return null;

  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden pt-0 pb-2 transition-transform duration-300 hover:scale-105">
      {firstVariant.image_url && (
        <img
          src={firstVariant.image_url}
          alt={`Image of ${product.name}`}
          className="h-48 w-full bg-neutral-100 object-cover"
        />
      )}

      <CardContent className="flex flex-1 flex-col justify-between gap-y-4 px-5 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{product.name}</p>
          {firstVariant.price && (
            <p className="text-primary text-base font-bold">
              ₱{getLowestPrice(product)}
            </p>
          )}
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {product.description}
        </p>

        <div className="flex w-full gap-2">
          <Button
            asChild
            variant="outline"
            className="hover:bg-primary flex-1 hover:text-white"
          >
            <Link to={`/products/${product.slug}`}> Buy Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
