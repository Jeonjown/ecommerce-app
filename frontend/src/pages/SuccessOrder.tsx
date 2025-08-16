import { FaCircleCheck } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

const SuccessOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="flex h-[80vh] items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center shadow-lg">
        <FaCircleCheck className="mb-4 size-20 text-green-500" />
        <h1 className="mb-2 text-3xl font-bold text-green-700">
          Thank you for your purchase!
        </h1>

        <p className="text-gray-600">
          Your order was successful. We’ll send you an update once your order is
          on its way.
        </p>

        {orderId && (
          <p className="mt-4 text-gray-700">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}

        {/* Return Home button */}
        <Link
          to="/"
          className="mt-6 rounded-lg bg-green-600 px-6 py-2 font-medium text-white shadow transition hover:bg-green-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessOrder;
