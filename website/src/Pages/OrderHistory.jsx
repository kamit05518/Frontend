import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBoxOpen,
  FaUtensils,
  FaShoppingBag,
  FaExclamationTriangle,
  FaDatabase
} from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.5 },
  },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(""); // Track where data came from

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your orders");
          setLoading(false);
          return;
        }

        console.log("Fetching orders from API...");
        const res = await axios.get("http://localhost:5001/api/order/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("✅ Orders fetched from API:", res.data);
        
        if (res.data && Array.isArray(res.data)) {
          setOrders(res.data.reverse());
          setDataSource("database");
        } else {
          setError("Invalid data format received from server");
        }
        
      } catch (err) {
        console.error("❌ API error:", err.response?.data || err.message);
        
        // Check for specific error responses
        if (err.response?.status === 401) {
          setError("Please login to view your orders");
        } else if (err.response?.status === 404) {
          // No orders found in database is NOT an error
          setOrders([]);
          setDataSource("database");
        } else {
          // API failed, try localStorage fallback
          try {
            const storedOrders = localStorage.getItem("orderHistory");
            if (storedOrders) {
              const parsedOrders = JSON.parse(storedOrders);
              console.log("✅ Using orders from localStorage:", parsedOrders);
              setOrders(Array.isArray(parsedOrders) ? parsedOrders.reverse() : []);
              setDataSource("localstorage");
              setError("Connected to database but using local data as backup");
            } else {
              setOrders([]);
              setDataSource("database");
              setError(null); // No orders is not an error
            }
          } catch (localErr) {
            console.error("❌ localStorage error:", localErr);
            setError("Failed to load orders from both sources");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading your orders...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching from database...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4 p-6 bg-white rounded-lg shadow-md">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2"
        >
          Your Order History
        </motion.h1>
        
        <p className="text-center text-gray-600 mb-4">
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
          {dataSource && (
            <span className="text-sm text-blue-600 ml-2">
              (from {dataSource})
            </span>
          )}
        </p>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded max-w-2xl mx-auto">
            <div className="flex">
              <FaExclamationTriangle className="text-yellow-400 text-xl mr-3 mt-1" />
              <div>
                <p className="text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
            <FaDatabase className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500">Your order history is empty</p>
            <p className="text-sm text-gray-400 mt-2">
              Orders will appear here after you place them
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order, idx) => (
              <OrderCard key={order._id || order.orderId || idx} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component for order card
const OrderCard = ({ order }) => {
  const items = order.items || order.cartItems || [];
  const status = order.status || "Pending";
  const orderId = order.orderId || order._id || "N/A";
  const totalPrice = order.totalPrice || order.total || 0;
  
  return (
   <motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
  style={{
    borderLeft: `5px solid ${
      status === "Delivered" ? "#10b981" : 
      status === "Cancelled" ? "#ef4444" : "#f59e0b"
    }`
  }}
>

      {/* Status Badge */}
      <div className="absolute top-5 right-5">
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${
            status === "Delivered" ? "bg-green-100 text-green-800" :
            status === "Cancelled" ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Order Header */}
      <div className="flex items-center mb-5">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <FaBoxOpen className="text-blue-600" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Order #{orderId}
          </h2>
          <p className="text-sm text-gray-500">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 
             order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 
             "Date not available"}
          </p>
        </div>
      </div>

      {/* Items Ordered */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <FaUtensils className="mr-2 text-orange-500" />
          Items Ordered
        </h3>
        
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-40 h-50 bg-gray-200 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUtensils className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No items information available</p>
        )}
      </div>

      {/* Order Details */}
      <div className="space-y-3 text-gray-700">
        {order.address && (
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-red-500 mr-3 mt-1" size={16} />
            <span className="text-sm">
              {order.address}
            </span>
          </div>
        )}
        
        <div className="flex items-center">
          <FaRupeeSign className="text-green-600 mr-3" size={16} />
          <span className="font-semibold">
            Total: ₹{totalPrice.toFixed(2)}
          </span>
        </div>
        
        {order.paymentMethod && (
          <div className="flex items-center">
            <FaClock className="text-blue-500 mr-3" size={16} />
            <span className="text-sm capitalize">
              Payment: {order.paymentMethod}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};