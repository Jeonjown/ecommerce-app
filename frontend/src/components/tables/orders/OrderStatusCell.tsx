import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";

const statusStyles: Record<string, { bg: string; text: string }> = {
  unpaid: { bg: "bg-yellow-500", text: "text-black" },
  paid: { bg: "bg-green-500", text: "text-white" },
  refunded: { bg: "bg-gray-500", text: "text-white" },

  pending: { bg: "bg-yellow-500", text: "text-black" },
  processing: { bg: "bg-purple-500", text: "text-white" },
  shipped: { bg: "bg-blue-500", text: "text-white" },
  delivered: { bg: "bg-green-600", text: "text-white" },
  cancelled: { bg: "bg-red-500", text: "text-white" },

  requested: { bg: "bg-yellow-500", text: "text-black" },
  approved: { bg: "bg-green-500", text: "text-white" },
  rejected: { bg: "bg-red-500", text: "text-white" },

  none: { bg: "bg-gray-200", text: "text-black" },
};

const OrderStatusCell = ({
  orderId,
  value,
  field,
  options,
}: {
  orderId: number;
  value: string;
  field: "payment_status" | "order_status" | "refund_status";
  options: string[];
}) => {
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const handleChange = (newValue: string) => {
    updateOrderStatus({
      orderId,
      payload: { [field]: newValue },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${statusStyles[value]?.bg || "bg-gray-200"} ${
            statusStyles[value]?.text || "text-black"
          }`}
        >
          {value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => handleChange(opt)}>
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderStatusCell;
