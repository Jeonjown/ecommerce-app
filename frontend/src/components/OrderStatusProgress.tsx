// src/components/OrderStatusProgress.tsx
import React from "react";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const STEPS = [
  { key: "pending", label: "Pending", icon: Clock, percent: 12 },
  { key: "processing", label: "Processing", icon: Package, percent: 40 },
  { key: "shipped", label: "Shipped", icon: Truck, percent: 60 },
  { key: "delivered", label: "Delivered", icon: CheckCircle, percent: 100 },
] as const;

interface Props {
  status: OrderStatus;
  timestamps?: (string | undefined)[];
  className?: string;
}

const OrderStatusProgress: React.FC<Props> = ({
  status,
  timestamps,
  className,
}) => {
  const currentIndex = React.useMemo(
    () => STEPS.findIndex((s) => s.key === status),
    [status],
  );
  const isCancelled = status === "cancelled";
  const targetPercent = currentIndex >= 0 ? STEPS[currentIndex].percent : 0;

  // animate like shadcn examples
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    setProgress(0);
    const t = setTimeout(() => setProgress(targetPercent), 50);
    return () => clearTimeout(t);
  }, [targetPercent]);

  if (isCancelled) {
    return (
      <div className={` ${className ?? ""}`}>
        <Badge className="bg-red-100 px-4 py-2 text-red-700">
          Order Cancelled
        </Badge>
      </div>
    );
  }

  return (
    <div className={`relative my-6 ${className ?? ""}`}>
      {/* Progress track centered on the milestone row */}
      <div className="absolute top-1/3 right-4 left-4 z-0 -translate-y-1/2">
        <Progress
          value={progress}
          aria-label="Order progress"
          className="h-1.5 rounded-full bg-gray-200 [&>div]:bg-green-600"
        />
      </div>

      {/* Milestones */}
      <div className="relative z-10 flex min-h-[72px] items-center px-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = currentIndex > i;
          const isActive = currentIndex === i;

          return (
            <div
              key={step.key}
              className="flex grow basis-0 flex-col items-center"
            >
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-green-600 bg-green-600 text-white",
                  isActive &&
                    !isCompleted &&
                    "border-blue-600 bg-blue-600 text-white",
                  !isCompleted &&
                    !isActive &&
                    "border-gray-300 bg-white text-gray-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={[
                  "mt-2 text-center text-sm",
                  isActive
                    ? "font-semibold text-slate-900"
                    : isCompleted
                      ? "text-green-700"
                      : "text-gray-500",
                ].join(" ")}
              >
                {step.label}
              </span>

              {timestamps?.[i] && (
                <span className="text-muted-foreground mt-1 text-xs">
                  {timestamps[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusProgress;
