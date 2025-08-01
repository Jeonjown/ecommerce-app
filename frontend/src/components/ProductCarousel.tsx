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

const ProductCarousel = () => {
  const { data } = useGetProducts();

  const flattenedVariants = data?.products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productName: product.name,
      productDescription: product.description,
    })),
  );

  return (
    <div className="relative mt-8 mb-10">
      <h2 className="my-5 text-2xl font-bold">Your Next Find Awaits!</h2>
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
                        ₱{variant.price}
                      </p>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {variant.productDescription}
                  </p>
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-white"
                  >
                    View
                  </Button>
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
};

export default ProductCarousel;
