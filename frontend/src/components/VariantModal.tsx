import type { ProductOption, ProductWithCategory } from "@/types/api/products";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import OptionsList from "./OptionsList";
import { useGetVariantsbyProductId } from "@/hooks/useGetVariantsbyProductId";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

interface VariantModalProps {
  productName: string;
  productOptions: ProductOption[];
  product: ProductWithCategory;
}

export function VariantModal({ product }: VariantModalProps) {
  const { data = [] } = useGetVariantsbyProductId(product.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name} Variants</DialogTitle>
          <DialogDescription>
            A list of all available variants and their details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[75vh] flex-col space-y-6 overflow-y-auto pr-2">
          <OptionsList id={product.id} />

          {/* Variants Grid */}
          <Button className="ml-auto">Add Variant</Button>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {data.map((variant) => (
              <Card
                key={variant.id}
                className="rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md"
              >
                <CardHeader className="pb-0">
                  <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={variant.image_url}
                      alt="variant image"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardHeader>

                <CardContent className="pt-2">
                  <h3 className="text-sm font-semibold">{variant.sku}</h3>

                  <p className="text-muted-foreground mt-2 mb-4 text-sm">
                    ₱{Number(variant.price).toFixed(2)}
                  </p>

                  <p className="mb-2 text-sm text-gray-600">
                    Stock: {variant.stock}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-0">
                  <Badge
                    variant={variant.is_active ? "default" : "destructive"}
                    className="px-2 py-1 text-xs"
                  >
                    {variant.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <div className="space-x-1">
                    <Button size="icon" variant="outline">
                      <FaEdit />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <FaTrashAlt />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <DialogClose asChild>
          <Button variant="secondary" className="mt-4">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
