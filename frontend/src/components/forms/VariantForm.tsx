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
import { UploadImageField } from "../ui/upload-image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetOptionsByProductId } from "@/hooks/useGetOptionsByProductId";
import { useCreateVariantByProductId } from "@/hooks/useCreateVariantByProductId";
import { useUploadImage } from "@/hooks/useUploadImage";
import Loading from "@/pages/Loading";

interface VariantFormProps {
  product_id: number;
  onSuccess: () => void;
}

// this matches your API's expected payload type
interface VariantOptionPayload {
  product_option_id: number;
  product_option_value_id: number;
}

export default function VariantForm({
  product_id,
  onSuccess,
}: VariantFormProps) {
  const { data } = useGetOptionsByProductId(product_id);
  const { mutate: createVariant, isPending: creating } =
    useCreateVariantByProductId(product_id);
  const { mutateAsync: uploadImage } = useUploadImage();

  // Build a Zod schema piece for each option, but optional
  const dynamicOptionFields =
    data?.options.reduce(
      (acc, option) => {
        acc[`option_${option.option_id}`] = z.string().optional();
        return acc;
      },
      {} as Record<string, z.ZodOptional<z.ZodString>>,
    ) ?? {};

  const formSchema = z
    .object({
      product_id: z.coerce.number().min(1),
      price: z.coerce.number().min(0, "Price must be ≥ 0"),
      stock: z.coerce.number().min(0, "Stock must be ≥ 0"),
      is_active: z.boolean(),
      image_file: z
        .instanceof(File)
        .refine((f) => f.size > 0, "Please select an image file"),
      ...dynamicOptionFields,
    })
    .superRefine((values, ctx) => {
      if (!data) return;

      // cast to a simple string map
      type OptionValuesMap = Record<string, string | undefined>;
      const opts = values as unknown as OptionValuesMap;

      const chosenCount = data.options.reduce((count, option) => {
        const raw = opts[`option_${option.option_id}`];
        return count + (raw && raw !== "none" ? 1 : 0);
      }, 0);

      if (chosenCount < 1) {
        ctx.addIssue({
          path: [`option_${data.options[0].option_id}`],
          message: "Please select at least one option.",
          code: z.ZodIssueCode.custom,
        });
      }
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

      // map into payload, skipping "none" or undefined
      const selectedOptions =
        data?.options
          .map((option) => {
            const key = `option_${option.option_id}` as keyof FormValues;
            // First read as unknown, then cast explicitly to string | undefined:
            const raw = (values as Record<string, unknown>)[key] as
              | string
              | undefined;

            // Now TS knows raw is string|undefined, so comparing to "none" is OK
            if (!raw || raw === "none") return null;

            return {
              product_option_id: option.option_id,
              product_option_value_id: parseInt(raw, 10),
            } as VariantOptionPayload;
          })
          .filter((o): o is VariantOptionPayload => o !== null) ?? [];
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
          {/* 1) Image upload */}
          <UploadImageField name="image_file" label="Variant Image" />

          {/* 2) Dynamic option selects */}
          <div className="flex flex-wrap gap-4">
            {data?.options.map((option) => (
              <FormField
                key={option.option_id}
                name={`option_${option.option_id}`}
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>{option.option_name} </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* “None” must be a non-empty value for Radix */}
                        <SelectItem value="none">None</SelectItem>
                        {option.values.map((v) => (
                          <SelectItem
                            key={v.value_id}
                            value={String(v.value_id)}
                          >
                            {v.value_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* 3) Price */}
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

          {/* 4) Stock */}
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

          {/* 5) Active */}
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

          {/* 6) Submit */}
          <Button type="submit" disabled={creating}>
            {creating ? "Submitting…" : "Create Variant"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
