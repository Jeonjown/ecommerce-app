// src/components/forms/VariantForm.tsx
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

const formSchema = z.object({
  product_id: z.coerce.number().min(1),
  price: z.coerce.number().min(0, "Price must be ≥ 0"),
  stock: z.coerce.number().min(0, "Stock must be ≥ 0"),
  is_active: z.boolean(),
  image_file: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Please select an image file"),
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
  const { mutate: createVariant, isPending: creating } =
    useCreateVariantByProductId(product_id);
  const { mutateAsync: uploadImage } = useUploadImage();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id,
      price: 0,
      stock: 0,
      is_active: true,
      image_file: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      //  upload image and get back the url
      const url = await uploadImage(values.image_file);

      // create variant with that url
      createVariant(
        {
          product_id,
          price: values.price,
          stock: values.stock,
          is_active: values.is_active,
          image_url: url,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            methods.reset();
          },
        },
      );
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image chooser (deferred upload) */}
          <UploadImageField name="image_file" label="Variant Image" />

          {/* Price */}
          <FormField
            control={methods.control}
            name="price"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={methods.control}
            name="stock"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
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
