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
import { useEditAddress } from "@/hooks/useEditAddress";

const schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

export type UpdateAddressFormValues = z.infer<typeof schema>;

interface EditAddressFormProps {
  addressId: number;
  initialData: UpdateAddressFormValues;
  onDone: () => void;
}

export const EditAddressForm: React.FC<EditAddressFormProps> = ({
  addressId,
  initialData,
  onDone,
}) => {
  const { mutate, isPending } = useEditAddress();

  const form = useForm<UpdateAddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const onSubmit = (values: UpdateAddressFormValues) => {
    mutate(
      { id: addressId, payload: values },
      {
        onSuccess: () => onDone(),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {Object.entries(schema.shape).map(([field]) => (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof UpdateAddressFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {field.name.replace("_", " ").toUpperCase()}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

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
