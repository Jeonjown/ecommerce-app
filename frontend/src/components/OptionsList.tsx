import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useGetOptionsByProductId } from "@/hooks/useGetOptionsByProductId";
import type { OptionGroup } from "@/types/api/options";
import { Button } from "./ui/button";
import { FaRegEdit } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IoMdClose } from "react-icons/io";
import DeleteOptionModal from "./DeleteOptionModal";

interface OptionListProps {
  id: number;
}

const OptionsList = ({ id }: OptionListProps) => {
  const { data } = useGetOptionsByProductId(String(id));

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center justify-between text-lg">
          Available Options <Button>Add Options</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data && data?.options?.length > 0 ? (
          data?.options.map((option: OptionGroup) => (
            <div key={option.option_id}>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{`${option.option_name}:`}</p>

                {option.values.length > 0 ? (
                  option.values.map((value) => (
                    <Badge key={value.value_id} variant="outline">
                      {value.value_name}
                      <IoMdClose />
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    No values
                  </span>
                )}

                <div className="ml-auto flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FaRegEdit className="text-accent-foreground !size-5 hover:scale-105" />
                    </TooltipTrigger>
                    <TooltipContent side="right">Edit</TooltipContent>
                  </Tooltip>
                  <DeleteOptionModal
                    optionId={option.option_id}
                    optionName={option.option_name}
                    productId={id}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-foreground">No Options</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OptionsList;
