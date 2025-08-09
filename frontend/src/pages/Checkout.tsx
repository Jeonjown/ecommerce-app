import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import { useGetLoggedInUser } from "@/hooks/useGetLoggedInUser";
import type { CartItem } from "@/types/api/cart";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const { data } = useGetLoggedInUser();
  console.log(data);
  const { state } = useLocation();
  const { items = [], totalPrice = 0 } = state || {};
  const [paymentMethod, setPaymentMethod] = useState("online");

  const handlePlaceOrder = () => {
    const payload = {
      paymentMethod,
      items: items.map((item: CartItem) => ({
        productId: item.product_id,
        variantId: item.variant_id,
        quantity: item.quantity,
      })),
    };

    if (payload.paymentMethod === "online") {
      console.log("Order payload:", payload);
    } else {
      console.log("Order payload:", payload);
      // send `payload` to your backend
    }
  };

  return (
    <div className="space-y-6">
      {/* Delivery Address */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center space-x-2">
          <FaLocationDot />
          <h3 className="text-xl font-semibold">Delivery Address</h3>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="font-semibold">
            <p>John Doe</p>
            <p>0930492049</p>
          </div>

          <p className="flex-1 text-gray-700 md:mx-8">
            123 Palmview Street, Barangay San Isidro, Quezon City, Metro Manila,
            Philippines, 1101
          </p>

          <button className="font-semibold text-blue-500 hover:underline">
            Change
          </button>
        </div>
      </div>

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
