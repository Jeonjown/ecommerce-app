import { useParams } from "react-router-dom";

const FailedOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-100 p-6">
      <h1 className="mb-4 text-3xl font-bold text-red-700">Order Failed</h1>
      <p className="text-red-600">
        Unfortunately, your payment was not successful.
      </p>
      {orderId && (
        <p className="mt-2">
          Your order ID is <strong>{orderId}</strong>.
        </p>
      )}
      <p>Please try again or contact support.</p>
    </div>
  );
};

export default FailedOrder;
