import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./components/Cart";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminRoutes from "./components/AdminRoutes";
import AdminDashboard from "./components/AdminDashboard";
import { useGetLoggedInUser } from "./hooks/useGetLoggedInUser";
import AdminNavbar from "./components/AdminNavbar";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
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
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/cart" element={<Cart />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
