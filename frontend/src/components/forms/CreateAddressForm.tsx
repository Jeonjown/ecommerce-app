import { useForm } from "react-hook-form";
import { useCreateAddress } from "@/hooks/useCreateAddress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address } from "@/types/api/address";

type CreateAddressFormValues = Omit<
  Address,
  "id" | "user_id" | "created_at" | "is_default"
>;

export function CreateAddressForm({ onDone }: { onDone: () => void }) {
  const { mutate, isPending } = useCreateAddress();

  const { register, handleSubmit, reset } = useForm<CreateAddressFormValues>({
    defaultValues: {
      full_name: "",
      phone: "",
      street_address: "",
      city: "",
      province: "",
      postal_code: "",
      country: "",
    },
  });

  const onSubmit = (data: CreateAddressFormValues) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onDone();
      },
      onError: (err) => {
        // optional: show toast or form error
        console.error("Create address failed:", err);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input {...register("full_name", { required: true })} />
      </div>

      <div>
        <Label>Phone</Label>
        <Input {...register("phone", { required: true })} />
      </div>

      <div>
        <Label>Street Address</Label>
        <Input {...register("street_address", { required: true })} />
      </div>

      <div>
        <Label>City</Label>
        <Input {...register("city", { required: true })} />
      </div>

      <div>
        <Label>Province</Label>
        <Input {...register("province", { required: true })} />
      </div>

      <div>
        <Label>Postal Code</Label>
        <Input {...register("postal_code", { required: true })} />
      </div>

      <div>
        <Label>Country</Label>
        <Input {...register("country", { required: true })} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Add Address"}
      </Button>
    </form>
  );
}
