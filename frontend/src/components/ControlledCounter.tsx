import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface ControlledCounterProps {
  quantity: number;
  setQuantity: (value: number) => void;
  stock?: number;
}

const ControlledCounter = ({
  quantity,
  setQuantity,
  stock,
}: ControlledCounterProps) => {
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only numeric input
    if (/^\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  const handleBlur = () => {
    let value = parseInt(inputValue, 10);

    if (isNaN(value) || value < 1) value = 1;
    if (stock !== undefined && value > stock) value = stock;

    setQuantity(value);
    setInputValue(String(value));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
        type="button"
      >
        <Minus />
      </Button>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-16 rounded-none text-center"
      />
      <Button
        onClick={handleIncrement}
        disabled={stock !== undefined && quantity >= stock}
        className="rounded-none"
        type="button"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default ControlledCounter;
