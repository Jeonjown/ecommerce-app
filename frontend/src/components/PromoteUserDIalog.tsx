import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePromoteUser } from "@/hooks/usePromoteUser";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface PromoteUserDialogProps {
  userId: number;
  userName: string;
}

const PromoteUserDialog = ({ userId, userName }: PromoteUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const promoteUser = usePromoteUser();

  const handlePromote = () => {
    promoteUser.mutate(userId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Promote
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote User</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to promote{" "}
          <span className="font-semibold">{userName}</span> to <b>Admin</b>?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={promoteUser.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handlePromote} disabled={promoteUser.isPending}>
            {promoteUser.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromoteUserDialog;
