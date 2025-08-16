import { Edit, Trash } from "lucide-react";
import type { Address } from "@/types/api/address";
import { useEditAddress } from "@/hooks/useEditAddress";

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
}

const AddressList = ({ addresses, onEdit, onDelete }: AddressListProps) => {
  const { mutate } = useEditAddress();

  if (addresses.length === 0) {
    return <p>No addresses found.</p>;
  }

  const handleSetDefault = (address: Address) => {
    if (!address.is_default) {
      mutate({
        id: address.id,
        payload: { ...address, is_default: true },
      });
    }
  };

  return (
    <>
      {addresses.map((address) => (
        <div
          key={address.id}
          className="hover:bg-muted flex items-start justify-between rounded-md border p-4 hover:cursor-pointer"
          onClick={() => handleSetDefault(address)}
        >
          <div>
            <div className="font-semibold">
              <p>{address.full_name}</p>
              <p>{address.phone}</p>
            </div>

            <p>
              {address.street_address}, {address.city}, {address.province}{" "}
              {address.postal_code}
            </p>
            <p>{address.country}</p>
          </div>

          <div>
            <p
              className={`${address.is_default ? "border border-gray-500 px-2" : ""} mr-3 text-sm text-gray-500`}
            >
              {String(address.is_default ? "Default" : "")}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit address"
              title="Edit"
            >
              <Edit className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="text-red-600 hover:text-red-800"
              aria-label="Delete address"
              title="Delete"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AddressList;
