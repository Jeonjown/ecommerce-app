import { useParams } from "react-router-dom";

const SuccessOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-100 p-6">
      <h1 className="mb-4 text-3xl font-bold text-green-700">
        Order Successful
      </h1>
      <p className="text-green-600">Thank you for your purchase!</p>
      {orderId && (
        <p className="mt-2">
          Your order ID is <strong>{orderId}</strong>.
        </p>
      )}
    </div>
  );
};

export default SuccessOrder;
