import DeliveryAddress from "@/components/DeliveryAddress";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/api/cart";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const { state } = useLocation();
  const { items = [], totalPrice = 0 } = state || {};
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handlePlaceOrder = async () => {
    const payload = {
      deliveryAddress,
      paymentMethod,
      items: items.map((item: CartItem) => ({
        productId: item.product_id,
        variantId: item.variant_id,
        quantity: item.quantity,
      })),
    };

    try {
      if (paymentMethod === "online") {
        // Call your Stripe order endpoint
        const res = await fetch("http://localhost:3000/api/orders/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Failed to create Stripe checkout session");
        }

        const data = await res.json();
        // Redirect to Stripe Checkout page
        window.location.href = data.url;
      } else {
        // Call your COD order endpoint
        const res = await fetch("http://localhost:3000/api/orders/cod", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Failed to create COD order");
        }

        const data = await res.json();
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
      }
    } catch (error) {
      console.error(error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Delivery Address */}
      <DeliveryAddress setDeliveryAddress={setDeliveryAddress} />
      {/* Products Ordered */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold">Products Ordered</h3>

        {/* Table Header */}
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b pb-2 font-semibold md:grid">
          <p>Product</p>
          <p>Unit Price</p>
          <p>Quantity</p>
          <p>Item Subtotal</p>
        </div>

        {/* Map items from cart */}
        {items.map((item: CartItem) => (
          <div
            key={item.variant_id}
            className="flex flex-col gap-3 border-b py-3 md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-4"
          >
            {/* Product Info */}
            <div className="flex items-center gap-3">
              <img
                src={item.image_url}
                alt={item.name}
                className="h-12 w-12 rounded border object-cover"
              />
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">
                  Variation: {item.variant_id}
                </p>
              </div>
            </div>

            {/* Unit Price */}
            <p className="text-gray-500">
              <span className="md:hidden"> Unit Price: </span> ₱
              {Number(item.price).toFixed(2)}
            </p>

            {/* Quantity */}
            <p className="text-gray-500">
              <span className="md:hidden">Quantity: </span>
              {item.quantity}
            </p>

            {/* Item Subtotal */}
            <p className="font-semibold">
              <span className="md:hidden">Item Subtotal: </span>₱
              {(Number(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="mb-40 rounded-lg border bg-white p-6 shadow-sm">
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      {/* Total Payment */}
      <div className="fixed bottom-0 container mx-auto rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-end gap-4 md:flex-row md:justify-between">
          <div className="text-xl font-semibold">
            <span className="mr-2">Total Payment:</span>₱{totalPrice.toFixed(2)}
          </div>
          <Button size="lg" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
