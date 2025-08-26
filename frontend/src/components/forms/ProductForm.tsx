import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { useGetCategories } from "@/hooks/useGetCategories";
import { useCreateProducts } from "@/hooks/useCreateProducts";
import { Textarea } from "../ui/textarea";
import Loading from "@/pages/Loading";
import Error from "@/pages/Error";

// ✅ Validation schema
const formSchema = z.object({
  category_id: z.coerce.number({ required_error: "Category is required" }),
  name: z.string().nonempty("Name is required"),
  brand: z.string().nonempty("Brand is required"), // 👈 Added brand
  description: z.string().nonempty("Description is required"),
  is_active: z.boolean({
    required_error: "is_active is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC = () => {
  const {
    data,
    isPending: isCategoriesPending,
    isError: categoryError,
  } = useGetCategories();
  const {
    mutate: createProduct,
    isPending: isProductsPending,
    isError: productError,
  } = useCreateProducts();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: undefined,
      name: "",
      brand: "", // 👈 Added default
      description: "",
      is_active: true,
    },
  });

  const { reset } = form;

  const onSubmit = async (data: FormValues) => {
    createProduct({ data, reset });
  };

  if (isProductsPending || isCategoriesPending) {
    return <Loading />;
  }

  if (categoryError || productError) {
    return <Error />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6">
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

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category Select */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  value={
                    field.value !== undefined ? field.value.toString() : ""
                  }
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Checkbox */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
              </FormControl>
              <FormLabel>Active</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit">Create Product</Button>
      </form>
    </Form>
  );
};

export default ProductForm;
