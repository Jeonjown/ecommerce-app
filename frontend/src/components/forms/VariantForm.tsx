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
import { Switch } from "@/components/ui/switch";

import { useCreateVariantByProductId } from "@/hooks/useCreateVariantByProductId";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

const formSchema = z.object({
  product_id: z.coerce.number().min(1),
  price: z.coerce.number().min(0, "Price must be ≥ 0"),
  stock: z.coerce.number().min(0, "Stock must be ≥ 0"),
  image_url: z.string().url("Must be a valid URL"),
  is_active: z.boolean(),
  // options: z.array(
  //   z.object({
  //     name: z.string(),
  //     value: z.string().min(1, "Please select a value"),
  //   }),
  // ),
});
type FormValues = z.infer<typeof formSchema>;

interface VariantFormProps {
  product_id: number;
  onSuccess: () => void;
}

export default function VariantForm({
  product_id,
  onSuccess,
}: VariantFormProps) {
  // const { data: optionGroups } = useGetOptionsByProductId(product_id);
  const { mutate } = useCreateVariantByProductId(product_id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id,
      price: 0,
      stock: 0,
      image_url: "https://picsum.photos/seed/TqYKi/800/600?blur=5",
      is_active: true,
    },
  });

  // once we have optionGroups, seed the options field array
  // useEffect(() => {
  //   if (optionGroups?.options) {
  //     form.setValue(
  //       "options",
  //       optionGroups.options.map(({ option_name }) => ({
  //         name: option_name,
  //         value: "",
  //       })),
  //     );
  //   }
  // }, [optionGroups, form]);

  const onSubmit = (values: FormValues) => {
    console.log("Submit payload:", values);
    mutate(values, {
      onSuccess: () => {
        onSuccess?.(); // 👈 call the parent handler
        form.reset(); // optional: reset the form
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Active</FormLabel>
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Option selects
        {fields.map((f, idx) => {
          const group = optionGroups?.options[idx];
          return (
            <FormField
              key={f.id}
              control={form.control}
              name={`options.${idx}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{group?.option_name}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={`Select ${group?.option_name}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {group?.values.map((v) => (
                          <SelectItem key={v.value_id} value={v.value_name}>
                            {v.value_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })} */}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting…" : "Create Variant"}
        </Button>
      </form>
    </Form>
  );
}
