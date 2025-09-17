
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/adminlayout";
import Dashboard from "./pages/dashboard";
import Categories from "./pages/categories";
import Subcategories from "./pages/subcategories";
import MenuItem from "./pages/menu-items";
import Chefs from "./pages/chefs";
import Contact from "./pages/contact";
import Orderhistory from "./pages/orderhistory";
import Login from "./pages/login";
import Registeration from "./pages/registeration";
import Tracklocation from "./pages/tracklocation";
import Paymentgetway from "./pages/paymentgetway";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <Router>
      <Routes>
      

        {/* Login & Registration without AdminLayout */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registeration" element={<Registeration />} />

        {/*  Admin Routes wrapped inside AdminLayout */}
        <Route
          path="/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="categories" element={<Categories />} />
                <Route path="subcategories" element={<Subcategories />} />
                <Route path="menu-items" element={<MenuItem />} />
                <Route path="chefs" element={<Chefs />} />
                <Route path="contact" element={<Contact />} />
                <Route path="orderhistory" element={<Orderhistory />} />
                <Route path="track-location" element={<Tracklocation />} />
                <Route path="payment-gateway" element={<Paymentgetway />} />
                <Route path="order-history" element={<Orderhistory />} />
                
              </Routes>
                 <ToastContainer position="top-center" autoClose={3000} />
            </AdminLayout>
            
          }
          
        />

      </Routes>
    </Router>
  );
}

export default App;
