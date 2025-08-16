import { useEffect } from "react";
import { useGetAddresses } from "@/hooks/useGetAddresses";
import { FaLocationDot } from "react-icons/fa6";
import AddressCard from "./AddressCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeliveryAddressProps {
  setDeliveryAddress: React.Dispatch<React.SetStateAction<string>>;
}

const DeliveryAddress = ({ setDeliveryAddress }: DeliveryAddressProps) => {
  const { data } = useGetAddresses();

  // find default
  let defaultAddress =
    data?.addresses.find((address) => address.is_default) || null;

  // if no default but still have addresses, fallback to the first one
  if (!defaultAddress && data?.addresses.length) {
    defaultAddress = data.addresses[0];
  }

  // Format address string
  useEffect(() => {
    if (defaultAddress) {
      const addressString = [
        defaultAddress.street_address,
        defaultAddress.city,
        defaultAddress.province,
        defaultAddress.postal_code,
        defaultAddress.country,
      ]
        .filter(Boolean)
        .join(", ");

      setDeliveryAddress(addressString);
    }
  }, [defaultAddress, setDeliveryAddress]);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-2">
        <FaLocationDot />
        <h3 className="text-xl font-semibold">Delivery Address</h3>
      </div>

      {defaultAddress ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Name & Phone */}
          <div className="font-semibold">
            <p>{defaultAddress.full_name}</p>
            <p>{defaultAddress.phone}</p>
          </div>

          {/* Address */}
          <p className="flex-1 text-gray-700 md:mx-8">
            {defaultAddress.street_address}, {defaultAddress.city},{" "}
            {defaultAddress.province}, {defaultAddress.postal_code},{" "}
            {defaultAddress.country}
          </p>

          {/* Change Button */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="font-semibold text-blue-500 hover:underline">
                Change
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Delivery Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <AddressCard />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-500">No Default address found.</p>

          {/* Add Button (always shows modal) */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="font-semibold text-blue-500 hover:underline">
                Add
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <AddressCard />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
