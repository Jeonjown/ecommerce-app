import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAddresses } from "@/hooks/useGetAddresses";
import DeleteAddressModal from "./modals/DeleteAddressModal";
import { EditAddressModal } from "./modals/EditAddressModal";
import type { Address } from "@/types/api/address";
import CreateAddressModal from "./modals/CreateAddressModal";
import AddressList from "./AddressList";

const AddressCard = () => {
  const { data: addressData } = useGetAddresses();
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const addresses = addressData?.addresses ?? [];

  const handleOpenDeleteModal = (id: number) => {
    setIdToDelete(id);
    setDeleteModalOpen(true);
  };

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
          <AddressList
            addresses={addresses}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </CardContent>
      </Card>

      {idToDelete !== null && (
        <DeleteAddressModal
          addressId={idToDelete}
          open={isDeleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleCloseDeleteModal}
        />
      )}

      {addressToEdit !== null && (
        <EditAddressModal
          address={addressToEdit}
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

export default AddressCard;
