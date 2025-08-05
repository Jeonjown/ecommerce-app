import { useCartStore } from "@/stores/useCartStore";

const Cart = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  if (items.length === 0) return <p>Your cart is empty</p>;

  return (
    <div>
      {items.map((item) => (
        <div key={item.variant_id}>
          <img src={item.image_url} alt={item.name} />
          <p>{item.name}</p>
          <p>₱ {item.price}</p>
          <p>Stock: {item.stock}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.variant_id, +e.target.value)}
          />
          <button onClick={() => removeItem(item.variant_id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
