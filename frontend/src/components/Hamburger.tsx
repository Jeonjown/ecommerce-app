import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

interface HamburgerMenuProps {
  isOpen: boolean;
  toggle: () => void;
}

const HamburgerMenu = ({ isOpen, toggle }: HamburgerMenuProps) => {
  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center hover:cursor-pointer focus:outline-none md:hidden"
      aria-label="Toggle Menu"
    >
      {isOpen ? <IoMdClose size={24} /> : <RxHamburgerMenu size={24} />}
    </button>
  );
};

export default HamburgerMenu;
