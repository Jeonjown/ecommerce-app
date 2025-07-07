import { FaRegUser } from "react-icons/fa6";
import { BsCartPlus } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import HamburgerMenu from "./Hamburger";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetLoggedInUser } from "../hooks/useGetLoggedInUser";
import { useLogoutUser } from "../hooks/useLogoutUser";

const Navbar = () => {
  const { data } = useGetLoggedInUser();
  const { mutate } = useLogoutUser();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <nav className="relative container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold">LOGO</div>

        {/* Desktop Nav Links (moved before search) */}
        <ul className="hidden space-x-6 font-semibold md:flex lg:mx-auto">
          <li>Categories</li>
          <li>New Deals</li>
          <li>Delivery</li>
        </ul>

        {/* Search */}
        <div className="order-3 flex w-full items-center rounded-lg border border-gray-300 md:order-none md:w-[400px] lg:mx-auto lg:w-[500px]">
          <input
            type="text"
            placeholder="search products..."
            className="h-10 w-full rounded p-2"
          />
          <button className="p-2">
            <IoSearch size={20} />
          </button>
        </div>

        {/* Icons */}
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <BsCartPlus size={24} />
            <span className="">Cart</span>
          </div>

          {data ? (
            <div className="flex items-center space-x-1">
              <FaRegUser size={22} />
              <span>{data.user.name}</span>
              <button className="border" onClick={() => mutate()}>
                Log out
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to={"/login"}>
                <button className="border px-2 py-1">Login</button>
              </Link>
              <Link to={"/signup"}>
                <button className="border px-2 py-1">Signup</button>
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <HamburgerMenu isOpen={menuOpen} toggle={toggleMenu} />

        {/* Mobile Menu */}
        <ul
          className={`absolute top-16 left-0 w-full transform flex-col items-center space-y-4 bg-white py-6 shadow-md transition-all duration-300 ease-in-out md:hidden ${
            menuOpen
              ? "pointer-events-auto flex translate-y-0 opacity-100"
              : "pointer-events-none hidden -translate-y-4 opacity-0"
          }`}
        >
          <li>Categories</li>
          <li>New Deals</li>
          <li>Delivery</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
