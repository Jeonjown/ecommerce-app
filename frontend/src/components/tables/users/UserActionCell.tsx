import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/api/user";
import DemoteUserDialog from "@/components/DemoteUserDialog";
import PromoteUserDialog from "@/components/PromoteUserDIalog";
import { Link } from "react-router-dom";

export function UserActionCell({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <Link to={`/admin/users/${user.id}`}>View</Link>
        </DropdownMenuItem>

        {/* Promote */}
        {user.role === "user" && (
          <PromoteUserDialog userId={user.id} userName={user.name} />
        )}

        {/* Demote */}
        {user.role === "admin" && (
          <DemoteUserDialog userId={user.id} userName={user.name} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
