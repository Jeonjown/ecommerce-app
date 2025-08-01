import { useState } from "react";
import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

import { useGetLoggedInUser } from "../hooks/useGetLoggedInUser";
import { useLogoutUser } from "../hooks/useLogoutUser";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import HamburgerMenu from "./Hamburger";

const Navbar = () => {
  const { data } = useGetLoggedInUser();
  const { mutate } = useLogoutUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="relative container mx-auto flex flex-wrap items-center justify-between gap-4 py-4">
      {/* Logo */}
      <div className="flex items-center">
        <Link to={"/"}>
          <img
            src="/techhaven-logo.svg"
            alt="TechHaven"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden space-x-6 font-semibold md:flex lg:mx-auto">
        <li>
          <Link to="/categories">Categories</Link>
        </li>
        <li>
          <Link to="/deals">New Deals</Link>
        </li>
        <li>
          <Link to="/delivery">Delivery</Link>
        </li>
      </ul>

      {/* Search */}
      <div className="border-input focus-within:ring-ring order-3 flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-2 focus-within:ring-2 md:order-none md:w-[400px] lg:mx-auto lg:w-[500px]">
        <IoSearch size={20} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Icons */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Cart (unchanged) */}
        <Link to="cart">
          <button className="flex items-center space-x-1">
            <BsCartPlus size={24} />
            <span className="font-semibold">Cart</span>
          </button>
        </Link>

        {/* User Dropdown (shadcn styled) */}
        {data ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1 hover:cursor-pointer">
                <FaRegUser size={22} />
                <span className="font-medium">{data.user.name}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => mutate()}
                className="text-destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-x-2">
            <Link to="/login">
              <button className="border px-2 py-1">Login</button>
            </Link>
            <Link to="/signup">
              <button className="border px-2 py-1">Signup</button>
            </Link>
          </div>
        )}
      </div>

      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={menuOpen} toggle={toggleMenu} />

      {/* Mobile Menu */}
      <ul
        className={`absolute top-16 left-0 w-full transform flex-col items-center space-y-4 bg-white py-6 shadow-md transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "pointer-events-auto flex translate-y-0 opacity-100"
            : "pointer-events-none hidden -translate-y-4 opacity-0"
        }`}
      >
        <li>
          <Link to="/categories">Categories</Link>
        </li>
        <li>
          <Link to="/deals">New Deals</Link>
        </li>
        <li>
          <Link to="/delivery">Delivery</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
