import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateCategory } from "@/hooks/useUpdateCategory";

const schema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export type UpdateCategoryFormValues = z.infer<typeof schema>;

interface Props {
  categoryId: number;
  initialData: UpdateCategoryFormValues;
  onDone: () => void;
}

const UpdateCategoryForm: React.FC<Props> = ({
  categoryId,
  initialData,
  onDone,
}) => {
  const { mutate, isPending } = useUpdateCategory();

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const onSubmit = (values: UpdateCategoryFormValues) => {
    mutate(
      { id: categoryId, name: values.name },
      {
        onSuccess: () => onDone(),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onDone} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateCategoryForm;
