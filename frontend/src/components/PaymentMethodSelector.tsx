import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PaymentMethodSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>

      <RadioGroup value={value} onValueChange={onChange} className="flex">
        {/* Online */}
        <div
          onClick={() => onChange("online")}
          className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-3"
        >
          <RadioGroupItem value="online" id="online" />
          <Label htmlFor="online" className="w-full cursor-pointer">
            Online Payment (Credit / Debit / Online Wallet)
          </Label>
        </div>

        {/* Cash on Delivery */}
        <div
          onClick={() => onChange("cod")}
          className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-3"
        >
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="w-full cursor-pointer">
            Cash on Delivery
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
