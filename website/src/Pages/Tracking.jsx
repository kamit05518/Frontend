import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaBox,
  FaShippingFast,
  FaHome,
  FaClock,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaArrowLeft
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = [
  { label: "Order Placed", icon: <FaCheckCircle size={20} />, description: "Your order has been received" },
  { label: "Packed", icon: <FaBox size={20} />, description: "Items are being prepared" },
  { label: "Out for Delivery", icon: <FaShippingFast size={20} />, description: "On the way to you" },
  { label: "Delivered", icon: <FaHome size={20} />, description: "Order delivered successfully" },
];

export default function Tracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, cartItems = [], totalPrice = 0 } = location.state || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [estimatedTime] = useState("25-30 minutes");
  const [riderInfo] = useState({
    name: "Rahul Kumar",
    rating: "4.8",
    vehicle: "Bike • TN 38 AB 1234"
  });

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid order ID");
      return;
    }

   const fetchOrderStatus = async () => {
  try {
    const res = await axios.get(`http://localhost:5001/api/tracking/orders/${orderId}/status`);
    const data = res.data;

    setCurrentStep(prev => Math.max(prev, data.step));
    if (data.step >= steps.length - 1) {
      setIsComplete(true);
    }

    setCartItems(data.items || []);
    setTotalPrice(data.totalPrice || 0);
    
  } catch (err) {
    console.error(err);
  }
};


    fetchOrderStatus();
    const intervalId = setInterval(fetchOrderStatus,50000);

    return () => clearInterval(intervalId);
  }, [orderId, currentStep, isComplete]);

  const handleDeliveryComplete = () => {
    const completedOrder = {
      orderId,
      status: "Delivered",
      deliveredAt: new Date().toLocaleString(),
      total: totalPrice,
      items: cartItems,
    };

    let history = [];
    try {
      const stored = localStorage.getItem("orderHistory");
      history = stored ? JSON.parse(stored) : [];
    } catch {
      localStorage.removeItem("orderHistory");
    }

    localStorage.setItem("orderHistory", JSON.stringify([...history, completedOrder]));
    localStorage.removeItem("cart");

    toast.success("🎉 Order Delivered Successfully!");
  };

  const handleViewOrderHistory = () => {
    
      navigate("/orderhistory");
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-6 flex items-center justify-center">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-green-700 font-medium p-2 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">Follow your food journey in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Order #{orderId}</h2>
                  <p className="text-gray-600 text-sm">Placed on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {isComplete ? "Delivered" : "In Progress"}
                </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute left-4 top-5 w-1 bg-gray-200 h-[calc(100%-2rem)] rounded-full"></div>
                <motion.div
                  className="absolute left-4 top-5 w-1 bg-green-500 rounded-full origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: currentStep / (steps.length - 1) }}
                  transition={{ duration: 0.5 }}
                  style={{ transformOrigin: "top" }}
                />
                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start relative z-10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: index <= currentStep ? 1 : 0.6,
                        x: index <= currentStep ? 0 : -10,
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                          index <= currentStep
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="ml-4">
                        <p className={`font-semibold ${index <= currentStep ? "text-green-700" : "text-gray-500"}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                        {index === currentStep && !isComplete && (
                          <motion.div className="flex items-center mt-2 text-orange-500 text-sm">
                           
                          </motion.div>
                        )}
                        {index < currentStep && (
                          <motion.div className="flex items-center mt-2 text-green-500 text-sm">
                            <FaCheckCircle className="mr-1" />
                            Completed
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-blue-800">Estimated Delivery Time</p>
                    <p className="text-blue-600">{estimatedTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaShoppingBag className="mr-2 text-green-600" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div>
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-gray-700 font-semibold">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-300 text-lg font-semibold text-gray-800">
                    <span>Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Delivery Partner
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Name:</strong> {riderInfo.name}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Rating:</strong> ⭐ {riderInfo.rating}
              </p>
              <p className="text-gray-700">
                <strong>Vehicle:</strong> {riderInfo.vehicle}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={handleViewOrderHistory}
                className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${
                  isComplete ? "" : "opacity-70 "
                }`}
                
              >
                View Order History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
