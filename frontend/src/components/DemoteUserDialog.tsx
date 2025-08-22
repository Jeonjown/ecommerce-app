import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDemoteUser } from "@/hooks/useDemoteUser";

interface DemoteUserDialogProps {
  userId: number;
  userName: string;
}

const DemoteUserDialog = ({ userId, userName }: DemoteUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const demoteUser = useDemoteUser();

  const handleDemote = () => {
    demoteUser.mutate(userId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Demote
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demote User</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to demote{" "}
          <span className="font-semibold">{userName}</span> to <b>User</b>?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={demoteUser.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleDemote} disabled={demoteUser.isPending}>
            {demoteUser.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemoteUserDialog;
