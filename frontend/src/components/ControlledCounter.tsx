import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ControlledCounterProps {
  quantity: number;
  setQuantity: (value: number) => void;
  stock?: number; // Optional: if not provided, no max limit
}

const ControlledCounter = ({
  quantity,
  setQuantity,
  stock,
}: ControlledCounterProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (isNaN(value)) return;

    // Clamp to valid range
    if (value < 0) value = 0;
    if (stock !== undefined && value > stock) value = stock;

    setQuantity(value);
  };

  const handleDecrement = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    if (stock === undefined || quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="flex w-fit">
      <Button
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="rounded-none"
      >
        <Minus />
      </Button>
      <Input
        value={quantity}
        onChange={handleInputChange}
        className="max-w-15 rounded-none text-center"
        type="number"
        min={0}
        max={stock}
      />
      <Button
        onClick={handleIncrement}
        disabled={stock !== undefined && quantity >= stock}
        className="rounded-none"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default ControlledCounter;
