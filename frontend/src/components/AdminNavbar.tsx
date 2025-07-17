import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";

import { useGetLoggedInUser } from "../hooks/useGetLoggedInUser";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useLogoutUser } from "@/hooks/useLogoutUser";

const AdminNavbar = () => {
  const { data } = useGetLoggedInUser();
  const { mutate } = useLogoutUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Dashboard", to: "#" },
    { label: "Products", to: "/admin/products" },
    { label: "Categories", to: "#" },
    { label: "Orders", to: "#" },
    { label: "Users", to: "#" },
  ];

  return (
    <nav className="relative container mx-auto flex flex-wrap items-center justify-between gap-4 p-4">
      {/* Logo */}
      <div className="mr-5 text-2xl font-bold">LOGO</div>

      {/* Desktop Nav Links */}
      <ul className="hidden space-x-6 font-semibold md:flex lg:mx-auto">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>

      {/* Right Section (Auth or User) */}
      <div className="ml-auto flex items-center space-x-4 hover:cursor-pointer">
        {data ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2">
                <FaRegUser size={20} />
                <p className="font-semibold">{data.user.name}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className="text-destructive" onClick={() => mutate()}>
                  Logout
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-x-2">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline">Signup</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Hamburger Menu */}
      <div className="md:hidden">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="pt-6">
            <ul className="flex flex-col space-y-4 font-semibold">
              {links.map((link) => (
                <li key={link.label} className="text-center">
                  <Link to={link.to} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default AdminNavbar;
