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
// import { useUploadImage } from "@/hooks/useUploadImage";
// import { VariantImageUploader } from "../VariantImageUploader ";

const formSchema = z.object({
  category_id: z.coerce.number({ required_error: "Category is required" }),
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  is_active: z.boolean({
    required_error: "is_active is required",
  }),
  // options: z
  //   .array(
  //     z.object({
  //       name: z.string().nonempty("Option name is required"),
  //       values: z
  //         .array(z.string().nonempty("Option value is required"))
  //         .min(1, "At least one option value is required"),
  //     }),
  //   )
  //   .min(1, "At least one option is required"),
  // variants: z
  //   .array(
  //     z.object({
  //       price: z.number().gt(0, "Price must be greater than 0"),
  //       stock: z.number().gte(0, "Stock cannot be negative"),
  //       image_url: z.string().optional(),
  //       is_active: z.boolean(),
  //       options: z
  //         .array(
  //           z.object({
  //             name: z.string().nonempty("Option name is required"),
  //             value: z.string().nonempty("Option value is required"),
  //           }),
  //         )
  //         .min(1, "At least one variant option is required"),
  //     }),
  //   )
  //   .min(1, "At least one variant is required"),
});
type FormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC = () => {
  const { data } = useGetCategories();
  const { mutate: createProduct } = useCreateProducts();

  // const { mutateAsync: uploadImage } = useUploadImage();

  // keep track of selected File for each variant
  // const [variantFiles, setVariantFiles] = useState<(File | null)[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: undefined,
      name: "",
      description: "",
      is_active: true,
      // options: [],
      // variants: [],
    },
  });

  const { reset } = form;

  // const optionsFieldArray = useFieldArray({
  //   control: form.control,
  //   name: "options",
  // });
  // const variantsFieldArray = useFieldArray({
  //   control: form.control,
  //   name: "variants",
  // });

  // const watchOptions = form.watch("options");

  // when adding/removing variants we also sync our variantFiles array
  // const appendVariant = () => {
  //   variantsFieldArray.append({
  //     price: 0,
  //     stock: 0,
  //     image_url: "",
  //     is_active: true,
  //     options: watchOptions.map((o) => ({ name: o.name, value: "" })),
  //   });
  //   setVariantFiles((v) => [...v, null]);
  // };
  // const removeVariant = (index: number) => {
  //   variantsFieldArray.remove(index);
  //   setVariantFiles((v) => v.filter((_, i) => i !== index));
  // };

  const onSubmit = async (data: FormValues) => {
    // const uploads = await Promise.all(
    //   variantFiles.map((file, i) => {
    //     if (!file) throw new Error(`Variant ${i + 1} has no image selected`);
    //     return uploadImage(file);
    //   }),
    // );
    // const urls = uploads.map((res) => res.url as string);
    // const payload = {
    //   ...vals,
    //   variants: vals.variants.map((v, i) => ({
    //     ...v,
    //     image_url: urls[i], // now populated here
    //   })),
    // };
    // )

    createProduct({ data, reset });
  };

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
        </div>

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

        {/* Options */}
        {/* <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Options</h3>
            <Button
              onClick={() => optionsFieldArray.append({ name: "", values: [] })}
            >
              Add Option
            </Button>
          </div>
          {optionsFieldArray.fields.map((opt, idx) => (
            <div key={opt.id} className="space-y-2 rounded border p-4">
              <FormField
                control={form.control}
                name={`options.${idx}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`options.${idx}.values`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Values</FormLabel>
                    <div className="space-y-2">
                      {field.value.map((v, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={v}
                            onChange={(e) => {
                              const copy = [...field.value];
                              copy[i] = e.target.value;
                              field.onChange(copy);
                            }}
                          />
                          <Button
                            variant="destructive"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((_, j) => j !== i),
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => field.onChange([...field.value, ""])}
                      >
                        Add Value
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div> */}

        {/* Variants */}
        {/* <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Variants</h3>
            <Button onClick={appendVariant}>Add Variant</Button>
          </div>
          {variantsFieldArray.fields.map((variant, i) => (
            <div key={variant.id} className="space-y-4 rounded border p-4">
              <Button
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={() => removeVariant(i)}
              >
                Remove
              </Button>

              <FormField
                control={form.control}
                name={`variants.${i}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`variants.${i}.stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variants.${i}.image_url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <VariantImageUploader
                        currentImageUrl={field.value}
                        onImageSelected={(file: File) => {
                          // store the picked file, but don’t upload yet
                          setVariantFiles((files) => {
                            const copy = [...files];
                            copy[i] = file;
                            return copy;
                          });
                          // clear the URL field until submit
                          field.onChange("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variants.${i}.is_active`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {watchOptions.map((opt, optIdx) => (
                  <FormField
                    key={`opt-${i}-${optIdx}`}
                    control={form.control}
                    name={`variants.${i}.options.${optIdx}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{opt.name}</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${opt.name}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {opt.values.map((v) => (
                                <SelectItem key={v} value={v}>
                                  {v}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div> */}

        <Button type="submit">Create Product</Button>
      </form>
    </Form>
  );
};

export default ProductForm;
