import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProducts } from "@/hooks/useGetProducts";

// Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

const ProductCarousel = () => {
  const { data, isPending } = useGetProducts();

  if (isPending) {
    return (
      <div className="relative mt-8 mb-10">
        <h2 className="m-5 text-2xl font-bold">Your Next Find Awaits!</h2>
        <Carousel>
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="flex h-full flex-col justify-between overflow-hidden pt-0 pb-2">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="flex flex-1 flex-col justify-between gap-y-4 px-5 pb-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-24" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  // Randomize product order
  const randomizedProducts = shuffleArray(data?.products || []);

  // Always pick the first variant of each product
  const firstVariants = randomizedProducts
    .map((product) => product.variants[0])
    .filter(Boolean)
    .map((variant, idx) => ({
      ...variant,
      productName: randomizedProducts[idx].name,
      productDescription: randomizedProducts[idx].description,
      productSlug: randomizedProducts[idx].slug,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="relative mt-8 mb-10"
    >
      <div className="flex items-center justify-between">
        <h2 className="m-5 text-2xl font-bold">Your Next Find Awaits!</h2>
        <h2 className="m-5 text-base font-semibold underline hover:cursor-pointer hover:font-bold">
          <Link to={"/categories"}>See More</Link>
        </h2>
      </div>

      <Carousel plugins={[Autoplay({ delay: 3000 })]}>
        <CarouselContent>
          {firstVariants?.map((variant, index) => (
            <CarouselItem
              key={index}
              className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card className="flex h-full flex-col justify-between overflow-hidden pt-0 pb-2">
                {variant.image_url && (
                  <div className="flex h-48 w-full items-center justify-center bg-neutral-100">
                    <img
                      src={variant.image_url}
                      alt={`Image of ${variant.productName}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col justify-between gap-y-4 px-5 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                      {variant.productName}
                    </p>
                    {variant.price && (
                      <p className="text-primary text-base font-bold">
                        ₱{(+variant.price).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {variant.productDescription}
                  </p>
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-white"
                    asChild
                  >
                    <Link to={`/products/${variant.productSlug}`}>View</Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute top-1/2 left-2 z-10 -translate-y-1/2" />
        <CarouselNext className="absolute top-1/2 right-2 z-10 -translate-y-1/2" />
      </Carousel>
    </motion.div>
  );
};

export default ProductCarousel;
