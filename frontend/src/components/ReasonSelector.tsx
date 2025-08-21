import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price",
  "Item not needed anymore",
  "Other",
];

interface ReasonSelectorProps {
  setReason: (val: string) => void;
}

const ReasonSelector = ({ setReason }: ReasonSelectorProps) => {
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");

  // Keep parent synced
  useEffect(() => {
    if (selected === "Other") {
      setReason(custom);
    } else {
      setReason(selected);
    }
  }, [selected, custom, setReason]);

  return (
    <div className="space-y-3">
      <RadioGroup
        value={selected}
        onValueChange={(val) => {
          setSelected(val);
          if (val !== "Other") setCustom("");
        }}
      >
        {REASONS.map((r) => (
          <div key={r} className="flex items-center space-x-2">
            <RadioGroupItem value={r} id={r} />
            <Label htmlFor={r}>{r}</Label>
          </div>
        ))}
      </RadioGroup>

      {selected === "Other" && (
        <div className="mt-3">
          <Label htmlFor="customReason">Please specify</Label>
          <Input
            id="customReason"
            placeholder="Enter your reason"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default ReasonSelector;
