import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetVariantOptions } from "@/hooks/useGetVariantOptions";

interface Props {
  variantId: number;
}

const VariantOptionsList = ({ variantId }: Props) => {
  const { data, isPending, isError } = useGetVariantOptions(variantId);

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
      {data.flatMap((option) =>
        option.values.map((value) => (
          <Badge key={value.value_id} variant="secondary">
            {value.value_name}
          </Badge>
        )),
      )}
    </div>
  );
};

export default VariantOptionsList;
