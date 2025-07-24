import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetOptionsByProductId } from "@/hooks/useGetOptionsByProductId";
import type { OptionGroup } from "@/types/api/options";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IoMdClose } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { useCreateOptions } from "@/hooks/useCreateOptions";
import { useState } from "react";
import { useCreateOptionValue } from "@/hooks/useCreateOptionValue";
import { useDeleteOptionValue } from "@/hooks/useDeleteOptionValue";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import DeleteOptionModal from "./modals/DeleteOptionModal";

interface OptionListProps {
  id: number;
}

const OptionsList = ({ id }: OptionListProps) => {
  const { data } = useGetOptionsByProductId(String(id));
  const { mutate } = useCreateOptions(String(id));
  const { mutate: createOptionValues } = useCreateOptionValue(String(id));

  const { mutate: deleteOptionValue } = useDeleteOptionValue(String(id));

  const [isAdding, setIsAdding] = useState(false);
  const [optionName, setOptionName] = useState("");

  const [activeAddValueId, setActiveAddValueId] = useState<number | null>(null);
  const [newValueName, setNewValueName] = useState("");

  const handleAddOption = () => {
    if (!optionName.trim()) return;
    mutate(optionName);
    setOptionName("");
    setIsAdding(false);
  };

  const handleAddValue = (optionId: number) => {
    if (!newValueName.trim()) return;
    createOptionValues({ id: optionId, value: newValueName }); // expects shape { optionId, value }
    setNewValueName("");
    setActiveAddValueId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          Available Options
          {!isAdding ? (
            <Button size="sm" onClick={() => setIsAdding(true)}>
              Add Option
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleAddOption}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setOptionName("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardTitle>

        {isAdding && (
          <Input
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
            placeholder="Enter option name"
            className="mt-1 h-8 w-full"
          />
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {data && data?.options?.length > 0 ? (
          data.options.map((option: OptionGroup) => (
            <div key={option.option_id}>
              <div className="flex items-center space-x-1">
                <p className="text-sm font-semibold">
                  {`${option.option_name}:`}
                </p>

                {activeAddValueId !== option.option_id ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FaCirclePlus
                        className="cursor-pointer"
                        onClick={() => setActiveAddValueId(option.option_id)}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Add Option Value
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div className="ml-2 flex items-center gap-2">
                    <Input
                      value={newValueName}
                      onChange={(e) => setNewValueName(e.target.value)}
                      placeholder="New value"
                      className="h-8 w-40"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddValue(option.option_id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setActiveAddValueId(null);
                        setNewValueName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {option.values.map((value) => (
                    <Dialog key={value.value_id}>
                      <DialogTrigger asChild>
                        <Badge
                          variant="outline"
                          className="cursor-pointer font-normal hover:scale-105 hover:font-semibold"
                        >
                          {value.value_name}
                          <IoMdClose className="ml-1" />
                        </Badge>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete this option value and all associated items
                            into it.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>

                          <Button
                            variant="destructive"
                            onClick={() => deleteOptionValue(value.value_id)}
                          >
                            Confirm
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>

                <div className="ml-auto">
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
