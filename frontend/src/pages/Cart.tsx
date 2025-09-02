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
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Cart = () => {
  const { data: items, isPending, isError } = useGetUserCart();
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  if (isPending) return <Loading />;
  if (isError || !items) return <Error />;

  const totalPrice = getTotalPrice(items);
  const totalQuantity = getTotalQuantity(items);
  if (items.length === 0)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <ShoppingCart className="text-muted-foreground h-16 w-16" />
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven’t added anything yet.
            </p>
            <Button asChild>
              <Link to="/categories">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );

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
                {/* ✅ Product Name */}
                <h2 className="text-xl font-semibold">{item.product_name}</h2>
                {/* ✅ Variant Name */}
                <CardTitle className="text-muted-foreground text-lg">
                  {item.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 p-0">
                <p className="text-muted-foreground">
                  ₱ {Number(item.price).toFixed(2)}
                </p>

                <p className="text-sm text-gray-600">Stock: {item.stock}</p>

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
              <Button asChild>
                <Link
                  to={"/checkout"}
                  state={{ items, totalPrice, totalQuantity }}
                  onClick={() => {
                    console.log("Passing to checkout:", {
                      items,
                      totalPrice,
                      totalQuantity,
                    });
                  }}
                >
                  Check Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
