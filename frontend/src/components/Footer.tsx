import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-foreground text-2xl font-bold">TechHaven</h2>
          <p className="mt-3 text-sm">
            Your one-stop shop for the latest gadgets, laptops, and accessories.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-foreground mb-3 text-lg font-semibold">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-foreground">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-foreground">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-foreground">
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/profile" className="hover:text-foreground">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-foreground">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Follow Us
          </h3>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-foreground">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-foreground">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-foreground">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-border border-t py-4 text-center text-sm">
        © {new Date().getFullYear()} TechHaven. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
