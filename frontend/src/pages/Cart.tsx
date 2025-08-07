import ControlledCounter from "@/components/ControlledCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getTotalPrice from "@/utils/getTotalPrice";
import getTotalQuantity from "@/utils/getTotalQuantity";
import { useGetUserCart } from "@/hooks/useGetUserCart";
import Loading from "./Loading";
import Error from "./Error";
import { useUpdateCartItem } from "@/hooks/useUpdateCartItem";
import { useRemoveCartItem } from "@/hooks/useRemoveCartItem";

const Cart = () => {
  const { data: items, isPending, isError } = useGetUserCart();
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  if (isPending) return <Loading />;
  if (isError || !items) return <Error />;

  const totalPrice = getTotalPrice(items);

  const totalQuantity = getTotalQuantity(items);
  if (items.length === 0)
    return <p className="p-6 text-center">Your cart is empty</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h3 className="mb-6 text-3xl font-semibold">Shopping Cart</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <Card
            key={item.variant_id}
            className="flex flex-col items-center gap-6 p-4 md:flex-row md:items-start"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="h-40 w-40 rounded-md object-cover"
            />

            <div className="w-full flex-1 space-y-2">
              <CardHeader className="p-0">
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 p-0">
                <p className="text-muted-foreground">
                  ₱ {Number(item.price).toFixed(2)}
                </p>

                <p className="text-sm text-gray-600">Stock: {item.stock}</p>

                {/* ✅ Total Price - looks more balanced here */}
                <div className="flex items-center gap-2 text-sm">
                  <p>Total Price:</p>
                  <p className="text-muted-foreground">
                    ₱ {(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <ControlledCounter
                    quantity={item.quantity}
                    setQuantity={(value) =>
                      updateQuantity({
                        ...item,
                        quantity: value,
                      })
                    }
                    stock={item.stock}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeItem(item.variant_id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 left-0 z-50 mt-5 w-full bg-white">
        <div className="mx-auto max-w-5xl rounded-lg border-2 p-4">
          <div className="flex w-full">
            <div className="ml-auto flex items-center gap-4">
              Total: ({totalQuantity} items)
              <span className="text-xl font-semibold">
                ₱{totalPrice.toFixed(2)}
              </span>
              <Button>Check Out</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
