import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminRoutes from "./components/AdminRoutes";

import { useGetLoggedInUser } from "./hooks/useGetLoggedInUser";
import AdminNavbar from "./components/AdminNavbar";

import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import SuccessOrder from "./pages/SuccessOrder";
import FailedOrder from "./pages/FailedOrder";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminOrdersDetails from "./pages/AdminOrdersDetails";
import AdminUsers from "./pages/AdminUsers";
import UserDetails from "./pages/UserDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Faqs from "./pages/Faqs";

function App() {
  const { data } = useGetLoggedInUser();

  return (
    <>
      {data?.user.role === "admin" ? <AdminNavbar /> : <Navbar />}
      <main className="container mx-auto">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoutes />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrdersDetails />} />
          </Route>
          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-success" element={<SuccessOrder />} />
            <Route path="/order-failed" element={<FailedOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>
          {/* Public Routes */}
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/categories" element={<Categories />}>
            <Route index element={<CategoryProducts />} />
            <Route path=":slug" element={<CategoryProducts />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
