import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { useCreateVariantByProductId } from "@/hooks/useCreateVariantByProductId";
import { useUploadImage } from "@/hooks/useUploadImage";
import { UploadImageField } from "../ui/upload-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOptionsByProductId } from "@/hooks/useGetOptionsByProductId";
import Loading from "@/pages/Loading";

interface VariantFormProps {
  product_id: number;
  onSuccess: () => void;
}

export default function VariantForm({
  product_id,
  onSuccess,
}: VariantFormProps) {
  const { data } = useGetOptionsByProductId(product_id);
  const { mutate: createVariant, isPending: creating } =
    useCreateVariantByProductId(product_id);
  const { mutateAsync: uploadImage } = useUploadImage();

  const dynamicOptionFields =
    data?.options.reduce(
      (acc, option) => {
        acc[`option_${option.option_id}`] = z.string().min(1, "Required");
        return acc;
      },
      {} as Record<string, z.ZodString>,
    ) ?? {};

  const formSchema = z.object({
    product_id: z.coerce.number().min(1),
    price: z.coerce.number().min(0, "Price must be ≥ 0"),
    stock: z.coerce.number().min(0, "Stock must be ≥ 0"),
    is_active: z.boolean(),
    image_file: z
      .instanceof(File)
      .refine((f) => f.size > 0, "Please select an image file"),
    ...dynamicOptionFields,
  });

  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id,
      price: 0,
      stock: 0,
      is_active: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const imageUrl = await uploadImage(values.image_file);

      const selectedOptions =
        data?.options.map((option) => {
          const key = `option_${option.option_id}`;
          const castedValues = values as Record<string, unknown>;
          const value = castedValues[key];

          return {
            product_option_id: option.option_id,
            product_option_value_id: parseInt(value as string, 10),
          };
        }) ?? [];

      createVariant(
        {
          product_id,
          price: values.price,
          stock: values.stock,
          is_active: values.is_active,
          image_url: imageUrl,
          variant_options: selectedOptions,
        },
        {
          onSuccess: () => {
            onSuccess();
            methods.reset();
          },
        },
      );
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (creating) return <Loading />;

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <UploadImageField name="image_file" label="Variant Image" />

          {/* Dynamic Selects for Options */}
          {data?.options.map((option) => (
            <FormField
              key={option.option_id}
              name={`option_${option.option_id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{option.option_name}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select ${option.option_name}`}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {option.values.map((value) => (
                        <SelectItem
                          key={value.value_id}
                          value={String(value.value_id)}
                        >
                          {value.value_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Price */}
          <FormField
            control={methods.control}
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
            control={methods.control}
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
            control={methods.control}
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

          {/* Submit */}
          <Button type="submit" disabled={creating}>
            {creating ? "Submitting…" : "Create Variant"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
