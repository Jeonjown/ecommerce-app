// OptionsList.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IoMdClose } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import type { OptionGroup } from "@/types/api/options";
import { useGetOptionsByProductId } from "@/hooks/useGetOptionsByProductId";
import { useCreateOptions } from "@/hooks/useCreateOptions";
import { useCreateOptionValue } from "@/hooks/useCreateOptionValue";
import { useDeleteOptionValue } from "@/hooks/useDeleteOptionValue";
import DeleteOptionModal from "./modals/DeleteOptionModal";

interface OptionListProps {
  id: number;
}

const OptionsList = ({ id: productId }: OptionListProps) => {
  // queries & mutations
  const { data } = useGetOptionsByProductId(productId);

  const { mutate: createOption, isPending: isCreatingOption } =
    useCreateOptions(productId);

  const { mutate: createOptionValue, isPending: isCreatingOptionValue } =
    useCreateOptionValue(productId);

  const { mutate: deleteOptionValue, isPending: isDeletingOptionValue } =
    useDeleteOptionValue(productId);

  // local UI state
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [optionName, setOptionName] = useState("");
  const [activeAddValueId, setActiveAddValueId] = useState<number | null>(null);
  const [newValueName, setNewValueName] = useState("");
  const [deleteDialogOpenForValueId, setDeleteDialogOpenForValueId] = useState<
    number | null
  >(null);

  const handleAddOption = () => {
    const trimmed = optionName.trim();
    if (!trimmed) return;

    createOption(trimmed, {
      onSuccess: () => {
        setOptionName("");
        setIsAddingOption(false);
      },
    });
  };

  const handleAddValue = (optionId: number) => {
    const trimmed = newValueName.trim();
    if (!trimmed) return;

    createOptionValue(
      { id: optionId, value: trimmed },
      {
        onSuccess: () => {
          setNewValueName("");
          setActiveAddValueId(null);
        },
      },
    );
  };

  const handleConfirmDelete = (valueId: number) => {
    deleteOptionValue(valueId, {
      onSuccess: () => {
        setDeleteDialogOpenForValueId(null);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          Available Options
          {!isAddingOption ? (
            <Button size="sm" onClick={() => setIsAddingOption(true)}>
              Add Option
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddOption}
                disabled={isCreatingOption}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingOption(false);
                  setOptionName("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardTitle>

        {isAddingOption && (
          <Input
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
            placeholder="Enter option name"
            className="mt-1 h-8 w-full"
          />
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {data?.options?.length ? (
          data.options.map((option: OptionGroup) => (
            <div key={option.option_id} className="flex">
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-semibold">{option.option_name}:</p>

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
                        disabled={isCreatingOptionValue}
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

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {option.values.map((value) => (
                    <div key={value.value_id} className="inline-block">
                      <Dialog
                        open={deleteDialogOpenForValueId === value.value_id}
                        onOpenChange={(open) => {
                          if (!open) setDeleteDialogOpenForValueId(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Badge
                            variant="outline"
                            className="inline-flex cursor-pointer items-center gap-2 px-3 py-1 font-normal hover:scale-105 hover:font-semibold"
                            onClick={() =>
                              setDeleteDialogOpenForValueId(value.value_id)
                            }
                          >
                            <span className="truncate">{value.value_name}</span>
                            <IoMdClose className="text-xs" />
                          </Badge>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <p className="text-muted-foreground text-sm">
                              This action cannot be undone. This will
                              permanently delete this option value.
                            </p>
                          </DialogHeader>

                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                setDeleteDialogOpenForValueId(null)
                              }
                            >
                              Cancel
                            </Button>

                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleConfirmDelete(value.value_id)
                              }
                              disabled={isDeletingOptionValue}
                            >
                              Confirm
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ml-auto">
                <DeleteOptionModal
                  optionId={option.option_id}
                  optionName={option.option_name}
                  productId={productId}
                />
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
