import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const Counter = ({ quantity, setQuantity }: CounterProps) => {
  return (
    <div className="flex w-fit">
      <Button
        onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
        className="rounded-none"
      >
        <Minus />
      </Button>
      <Input
        value={quantity}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value >= 0) setQuantity(value);
        }}
        className="max-w-15 rounded-none"
      />
      <Button
        onClick={() => setQuantity((prev) => prev + 1)}
        className="rounded-none"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default Counter;
