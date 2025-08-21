// pages/Checkout.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DeliveryAddress from "@/components/DeliveryAddress";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/api/cart";
import { useCreateStripeOrder } from "@/hooks/useCreateStripeOrder";
import { useCreateCODOrder } from "@/hooks/useCreateCODOrder";

const Checkout = () => {
  const { state } = useLocation();
  const { items = [], totalPrice = 0 } = state || {};
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const stripeMutation = useCreateStripeOrder();
  const codMutation = useCreateCODOrder();

  useEffect(() => {}, []);

  const handlePlaceOrder = () => {
    const payload = {
      deliveryAddress,
      paymentMethod,
      items: items.map((item: CartItem) => ({
        productId: item.product_id,
        variantId: item.variant_id,
        quantity: item.quantity,
      })),
    };

    if (paymentMethod === "online") {
      stripeMutation.mutate(payload);
    } else {
      codMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <DeliveryAddress setDeliveryAddress={setDeliveryAddress} />

      <div className="mb-40 rounded-lg border bg-white p-6 shadow-sm">
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      <div className="fixed bottom-0 container mx-auto rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-end gap-4 md:flex-row md:justify-between">
          <div className="text-xl font-semibold">
            <span className="mr-2">Total Payment:</span>₱{totalPrice.toFixed(2)}
          </div>
          <Button
            size="lg"
            onClick={handlePlaceOrder}
            disabled={
              !deliveryAddress ||
              stripeMutation.isPending ||
              codMutation.isPending
            }
          >
            {stripeMutation.isPending || codMutation.isPending
              ? "Placing..."
              : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
