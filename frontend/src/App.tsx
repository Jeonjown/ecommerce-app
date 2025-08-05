import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminRoutes from "./components/AdminRoutes";
import AdminDashboard from "./components/AdminDashboard";
import { useGetLoggedInUser } from "./hooks/useGetLoggedInUser";
import AdminNavbar from "./components/AdminNavbar";

import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
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
          </Route>
          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/categories" element={<Categories />}>
            <Route index element={<CategoryProducts />} />
            <Route path=":slug" element={<CategoryProducts />} />
          </Route>
          <Route path="/products/:slug" element={<ProductDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
