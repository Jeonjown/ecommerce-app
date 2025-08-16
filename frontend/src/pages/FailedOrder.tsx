import { FaCircleXmark } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

const FailedOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="flex h-[80vh] items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center shadow-lg">
        <FaCircleXmark className="mb-4 size-20 text-red-500" />
        <h1 className="mb-2 text-3xl font-bold text-red-700">Payment Failed</h1>

        <p className="text-gray-600">
          Unfortunately, your payment was not successful. Please try again or
          contact support.
        </p>

        {orderId && (
          <p className="mt-4 text-gray-700">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}

        {/* Return Home button */}
        <Link
          to="/"
          className="mt-6 rounded-lg bg-red-600 px-6 py-2 font-medium text-white shadow transition hover:bg-red-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default FailedOrder;
