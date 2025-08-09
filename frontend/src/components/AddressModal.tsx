import { useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAddresses } from "@/hooks/useGetAddresses";
import DeleteAddressModal from "./modals/DeleteAddressModal";
import { EditAddressModal } from "./modals/EditAddressModal";
import type { Address } from "@/types/api/address";
import CreateAddressModal from "./modals/CreateAddressModal";

const AddressModal = () => {
  const { data: addressData } = useGetAddresses();
  console.log(addressData);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [AddressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const addresses = addressData?.addresses ?? [];

  // When user clicks delete button:
  const handleOpenDeleteModal = (id: number) => {
    setIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // Close modal and clear selected id
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setIdToDelete(null);
  };

  const handleOpenEditModal = (address: Address) => {
    setAddressToEdit(address);
    setEditModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>My Addresses</CardTitle>
          <Button
            variant="default"
            size="sm"
            className="flex items-center space-x-2"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Address</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start justify-between rounded-md border p-4"
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
                  <p>{String(address.is_default)}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      handleOpenEditModal(address);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit address"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleOpenDeleteModal(address.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete address"
                    title="Delete"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No addresses found.</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      {idToDelete !== null && (
        <DeleteAddressModal
          addressId={idToDelete}
          open={isDeleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleCloseDeleteModal}
        />
      )}

      {/* Edit Modal */}
      {AddressToEdit !== null && (
        <EditAddressModal
          address={AddressToEdit}
          open={isEditModalOpen}
          onOpenChange={setEditModalOpen}
        />
      )}

      <CreateAddressModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </>
  );
};

export default AddressModal;
