import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useVariantOptions } from "@/hooks/useGetVariantOptions";

interface Props {
  variantId: number;
}

const VariantOptionsList = ({ variantId }: Props) => {
  const { data, isPending, isError } = useVariantOptions(variantId);

  if (isPending) {
    return (
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No variant options found.
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {data.map((option, index) => (
        <Badge key={index} variant="secondary">
          {option.option_value}
        </Badge>
      ))}
    </div>
  );
};

export default VariantOptionsList;
