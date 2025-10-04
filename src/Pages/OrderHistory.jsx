import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBoxOpen,
  FaUtensils,
  FaChevronDown,
  FaChevronUp,
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
  const [dataSource, setDataSource] = useState("");

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
        
        console.log(" Orders fetched from API:", res.data);
        
        if (res.data && Array.isArray(res.data)) {
          setOrders(res.data.reverse());
          setDataSource("database");
        } else {
          setError("Invalid data format received from server");
        }
        
      } catch (err) {
        console.error(" API error:", err.response?.data || err.message);
        
        if (err.response?.status === 401) {
          setError("Please login to view your orders");
        } else if (err.response?.status === 404) {
          setOrders([]);
          setDataSource("database");
        } else {
          try {
            const storedOrders = localStorage.getItem("orderHistory");
            if (storedOrders) {
              const parsedOrders = JSON.parse(storedOrders);
              console.log("📦 Using orders from localStorage:", parsedOrders);
              setOrders(Array.isArray(parsedOrders) ? parsedOrders.reverse() : []);
              setDataSource("localstorage");
              setError("Connected to database but using local data as backup");
            } else {
              setOrders([]);
              setDataSource("database");
              setError(null);
            }
          } catch (localErr) {
            console.error("💾 localStorage error:", localErr);
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
    <div className="min-h-screen bg-gray-100 py-8 px-4 mt-20">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2"
        >
          Your Order History
        </motion.h1>
        
        <p className="text-center text-gray-600 mb-6">
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
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <FaDatabase className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500">Your order history is empty</p>
            <p className="text-sm text-gray-400 mt-2">
              Orders will appear here after you place them
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <OrderCard key={order._id || order.orderId || idx} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = order.items || order.cartItems || [];
  const status = order.status || "Pending";
  const orderId = order.orderId || order._id || "N/A";
  const totalPrice = order.totalPrice || order.total || 0;
  
  // Get first 2 items for preview
  const previewItems = items.slice(0, 2);
  const remainingCount = items.length - 2;
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={{
        borderLeft: `5px solid ${
          status === "Delivered" ? "#10b981" : 
          status === "Cancelled" ? "#ef4444" : "#f59e0b"
        }`
      }}
    >
      {/* Collapsed View - Always Visible */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center flex-1">
            <div className="bg-orange-100 p-2 rounded-lg mr-3">
              <FaBoxOpen className="text-orange-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">
                Order #{orderId.toString().slice(-6)}
              </h3>
              <p className="text-xs text-gray-500">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                }) : "Date not available"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                status === "Delivered" ? "bg-green-100 text-green-800" :
                status === "Cancelled" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status}
            </span>
            {isExpanded ? (
              <FaChevronUp className="text-gray-400" size={18} />
            ) : (
              <FaChevronDown className="text-gray-400" size={18} />
            )}
          </div>
        </div>

        {/* Items Preview */}
        <div className="flex items-center gap-2 mb-2">
          {previewItems.map((item, i) => (
            <div key={i} className="flex items-center bg-gray-50 rounded-lg p-2 flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-2 flex-shrink-0">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUtensils className="text-gray-400" size={16} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="bg-gray-100 rounded-lg p-2 px-3 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">+{remainingCount}</span>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
          <span className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          <span className="font-bold text-green-600">₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            <div className="p-4 bg-gray-50">
              {/* All Items */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaUtensils className="mr-2 text-orange-500" size={14} />
                  All Items
                </h4>
                
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <div className="flex items-center flex-1">
                        <div className="w-14 h-14 bg-gray-200 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaUtensils className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600 ml-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Details</h4>
                
                {order.address && (
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-red-500 mr-3 mt-1 flex-shrink-0" size={14} />
                    <span className="text-sm text-gray-700">
                      {order.address}
                    </span>
                  </div>
                )}
                
                {order.paymentMethod && (
                  <div className="flex items-center">
                    <FaClock className="text-blue-500 mr-3 flex-shrink-0" size={14} />
                    <span className="text-sm text-gray-700 capitalize">
                      Payment: {order.paymentMethod}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <FaRupeeSign className="text-green-600 mr-2" size={14} />
                    <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};