import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { OrderRow } from "@/types/api/orders";

export type StatusField = "payment_status" | "order_status" | "refund_status";

const DEFAULT_WIDTH = "w-40";

export function StatusDropdownCell({
  row,
  field,
  options,
  onChange,
}: {
  row: OrderRow;
  field: StatusField;
  options: string[];
  onChange: (orderId: number, field: StatusField, newValue: string) => void;
}) {
  // current value
  const current = (row as any)[field] ?? "none";

  // If this is payment_status and payment_method === 'online', filter out 'unpaid'
  const filteredOptions =
    field === "payment_status" && row.payment_method === "online"
      ? options.filter((o) => o !== "unpaid")
      : options;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${DEFAULT_WIDTH} justify-between text-sm`}
        >
          {String(current)}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={DEFAULT_WIDTH}>
        {filteredOptions.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(row.order_id, field, opt)}
            className="w-full"
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StatusDropdownCell;
