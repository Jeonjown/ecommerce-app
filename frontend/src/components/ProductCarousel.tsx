import { useGetProducts } from "@/hooks/useGetProducts";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCarousel = () => {
  const { data, isPending } = useGetProducts();

  const flattenedVariants = data?.products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productName: product.name,
      productDescription: product.description,
      productSlug: product.slug,
    })),
  );

  if (isPending) {
    return (
      <div className="relative mt-8 mb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="m-5 h-7 w-52" />
          <Skeleton className="m-5 h-5 w-20" />
        </div>

        {/* Carousel Skeleton */}
        <Carousel>
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="flex h-full flex-col justify-between overflow-hidden pt-0 pb-2">
                  {/* Image skeleton */}
                  <Skeleton className="h-48 w-full bg-neutral-200" />

                  <CardContent className="flex flex-1 flex-col justify-between gap-y-4 px-5 pb-4">
                    {/* Title + Price */}
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>

                    {/* Description */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />

                    {/* Button */}
                    <Skeleton className="h-9 w-full rounded-md" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute top-1/2 left-2 z-10 -translate-y-1/2" />
          <CarouselNext className="absolute top-1/2 right-2 z-10 -translate-y-1/2" />
        </Carousel>
      </div>
    );
  }

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

      <Carousel
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent>
          {flattenedVariants?.map((variant, index) => (
            <CarouselItem
              key={index}
              className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card className="flex h-full flex-col justify-between overflow-hidden pt-0 pb-2">
                {variant.image_url && (
                  <img
                    src={variant.image_url}
                    alt={`Image of ${variant.productName}`}
                    className="h-48 w-full bg-neutral-100 object-cover"
                  />
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
