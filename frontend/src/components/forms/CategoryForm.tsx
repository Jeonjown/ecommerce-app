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

import { useCreateCategory } from "@/hooks/useCreateCategory";

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CategoryForm = () => {
  const { mutate: createCategory } = useCreateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset } = form;

  const onSubmit = (data: FormValues) => {
    createCategory({ name: data.name, reset });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Category</Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
