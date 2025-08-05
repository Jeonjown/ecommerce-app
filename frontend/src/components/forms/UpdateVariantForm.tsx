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
import { useUpdateVariantById } from "@/hooks/useUpdateVariantById";
import { useUploadImage } from "@/hooks/useUploadImage";
import Loading from "@/pages/Loading";
import { useGetVariantById } from "@/hooks/useGetVariantById";
import { useGetVariantOptions } from "@/hooks/useGetVariantOptions";

interface VariantOptionPayload {
  product_option_id: number;
  product_option_value_id: number;
}

interface VariantFormProps {
  product_id: number;
  onSuccess: () => void;
  onCancel?: () => void;
  variant_id?: number;
}

const UpdateVariantForm = ({
  product_id,
  variant_id,
  onCancel,
  onSuccess,
}: VariantFormProps) => {
  const { data: optionsData } = useGetOptionsByProductId(product_id);
  const { data: selectedVariantOptions } = useGetVariantOptions(
    variant_id ?? 0,
  );
  const { data: variant } = useGetVariantById(variant_id ?? 0);

  const { mutate: createVariant, isPending: creating } =
    useCreateVariantByProductId(product_id);
  const { mutate: updateVariant, isPending: updating } =
    useUpdateVariantById(product_id);
  const { mutateAsync: uploadImage } = useUploadImage();

  const isEdit = !!variant_id;

  const dynamicOptionFields =
    optionsData?.options.reduce(
      (acc, option) => {
        acc[`option_${option.option_id}`] = z.string().optional();
        return acc;
      },
      {} as Record<string, z.ZodOptional<z.ZodString>>,
    ) ?? {};

  const formSchema = z.object({
    product_id: z.coerce.number().min(1),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().min(0),
    is_active: z.boolean(),
    sku: z.string().min(1),
    name: z.string().min(1, "Name is required"),
    description: z.string().nonempty("Description is required"),
    image_file: isEdit
      ? z.instanceof(File).optional()
      : z.instanceof(File).refine((f) => f.size > 0, "Please select an image"),
    ...dynamicOptionFields,
  });

  type FormValues = z.infer<typeof formSchema> & {
    [key: `option_${number}`]: string | undefined;
  };

  const variantDefaults =
    selectedVariantOptions?.reduce(
      (acc, option) => {
        const value = option.values?.[0]?.value_id;
        if (value) acc[`option_${option.option_id}`] = String(value);
        return acc;
      },
      {} as Record<string, string>,
    ) ?? {};

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id,
      price: Number(variant?.price ?? 0),
      stock: Number(variant?.stock ?? 0),
      is_active: Boolean(variant?.is_active ?? true),
      sku: variant?.sku ?? "",
      name: variant?.name ?? "",
      description: variant?.description ?? "",
      ...variantDefaults,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const image_url = values.image_file
        ? await uploadImage(values.image_file)
        : (variant?.image_url ?? "");

      const variant_options =
        optionsData?.options
          .map((option) => {
            const val = values[`option_${option.option_id}`];
            if (!val || val === "none") return null;
            return {
              product_option_id: option.option_id,
              product_option_value_id: parseInt(val),
            };
          })
          .filter((v): v is VariantOptionPayload => v !== null) ?? [];

      const payload = {
        product_id,
        price: values.price,
        stock: values.stock,
        is_active: values.is_active,
        image_url,
        sku: values.sku,
        name: values.name,
        description: values.description,
        variant_options,
      };

      const onSuccessHandler = () => {
        methods.reset();
        onSuccess();
      };

      if (isEdit && variant_id) {
        updateVariant(
          { id: variant_id, payload },
          { onSuccess: onSuccessHandler },
        );
      } else {
        createVariant(payload, { onSuccess: onSuccessHandler });
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (creating || updating) return <Loading />;

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <UploadImageField
            name="image_file"
            label="Variant Image"
            defaultImageUrl={variant?.image_url}
          />

          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-4">
            {optionsData?.options.map((option) => (
              <FormField
                key={option.option_id}
                name={`option_${option.option_id}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{option.option_name}</FormLabel>
                    <Select
                      value={field.value ?? "none"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

          <FormField
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

          <FormField
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

          <FormField
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
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

          <div className="flex items-center gap-4">
            <Button type="submit">
              {isEdit ? "Update Variant" : "Create Variant"}
            </Button>

            {isEdit && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  methods.reset();
                  onCancel();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default UpdateVariantForm;
