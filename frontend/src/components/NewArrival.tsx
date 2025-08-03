import { useGetProducts } from "@/hooks/useGetProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";

const NewArrival = () => {
  const { data } = useGetProducts();

  const latestProducts = [...(data?.products || [])]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 8);

  const flattenedVariants = latestProducts
    .flatMap((product) =>
      product.variants.map((variant) => ({
        ...variant,
        productName: product.name,
        productDescription: product.description,
      })),
    )
    .slice(0, 6);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="mt-12 mb-16"
    >
      <div className="flex items-center justify-between">
        <h2 className="m-5 text-2xl font-bold">Your Next Find Awaits!</h2>
        <h2 className="m-5 text-base font-semibold underline hover:cursor-pointer hover:font-bold">
          See More
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {flattenedVariants.map((variant, index) => (
          <Card
            key={index}
            className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white pt-0 shadow-sm transition hover:shadow-md"
          >
            {variant.image_url && (
              <div className="relative">
                <img
                  src={variant.image_url}
                  alt={variant.productName}
                  className="h-48 w-full bg-neutral-100 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <CardContent className="flex flex-1 flex-col gap-y-3 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{variant.productName}</h3>
                {variant.price && (
                  <p className="text-primary text-base font-bold">
                    ₱{variant.price}
                  </p>
                )}
              </div>

              <p className="text-muted-foreground line-clamp-2 text-sm">
                {variant.productDescription}
              </p>

              <div className="mt-auto">
                <Button
                  variant="outline"
                  className="hover:bg-primary w-full transition-colors hover:text-white"
                >
                  View Product
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default NewArrival;
