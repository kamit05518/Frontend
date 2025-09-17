import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext"; // ✅ Import context


const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/categories", label: "Categories" },
  { path: "/subcategories", label: "Subcategories" },
  { path: "/menu-items", label: "Menu Items" },
  { path: "/chefs", label: "Chefs" },
  { path: "/track-location", label: "Track Location" },
  { path: "/payment-gateway", label: "Payment Gateway" },
  { path: "/order-history", label: "Order History" },
  { path: "/contact", label: "Contact" },
  
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { user, logout } = useContext(AuthContext); 
  const isLoggedIn = !!user;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  return (
    <div className="min-h-screen flex bg-blue-950 text-white transition-all duration-300 ease-in-out">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 bg-blue-950 h-screen fixed flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/20">
          <span className="font-bold text-lg whitespace-nowrap overflow-hidden transition-all duration-300">
            {isSidebarOpen ? "Admin Panel" : "AP"}
          </span>
          <button
            onClick={toggleSidebar}
            className="text-white text-sm px-2 py-1 bg-blue-900 rounded hover:bg-blue-950"
          >
            {isSidebarOpen ? "<<" : ">>"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 text-sm font-medium transition-all  ${
                location.pathname === item.path
                  ? "bg-blue-900"
                  : "hover:bg-blue-900"
              }`}
            >
              {isSidebarOpen ? item.label : item.label[0]}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4 text-center text-xs">
          {isSidebarOpen ? "© 2025 Admin" : "©"}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-blue-950 shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Welcome, Admin</h1>

         {isLoggedIn ? (
  <button
    onClick={() => {
      logout();
      navigate("/login");
    }}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
  >
    Logout
  </button>
) : (
  <div className="flex gap-4">
    {location.pathname === "/login" ? (
      <Link
        to="/registeration"
        className="bg-white text-blue-950 px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        Register
      </Link>
    ) : location.pathname === "/registeration" ? (
      <Link
        to="/login"
        className="bg-white text-blue-950 px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        Login
      </Link>
    ) : (
      <Link
        to="/dashboard"
        className="bg-white text-blue-950 px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        Login
      </Link>
    )}
  </div>
)}

        </header>

        {/* Main content area */}
        <main className="p-6 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
