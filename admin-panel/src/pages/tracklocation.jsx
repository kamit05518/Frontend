import React, { useEffect, useState } from "react";
import axios from "axios";

// Tracking step labels
const trackingSteps = ["Order Placed", "Order Packed", "Out For Delivery", "Delivered"];

const TrackLocationAdminPanel = () => {
  const [orders, setOrders] = useState([]);
   const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tracklocation/orders");
        console.log("API response:", res.data);
         setCartItems(res.data.cartItems);
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update step function (e.g., next status)
  const updateOrderStep = async (index, direction) => {
    const order = orders[index];
    const newStep = Math.max(0, Math.min(order.step + direction, trackingSteps.length - 1));

    try {
      const res = await axios.post("http://localhost:5000/api/tracklocation/orders/update-step", {
        orderId: order.orderId,
        step: newStep,
      });

      if (res.status === 200) {
        setOrders((prev) =>
          prev.map((o, i) => (i === index ? { ...o, step: newStep } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update order step:", err);
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto p-5">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">📦 Admin Order Tracking</h2>

        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Item(s)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => {
              const currentStatus = trackingSteps[order.step];
              const progressPercent = ((order.step + 1) / trackingSteps.length) * 100;

              const statusColor =
                order.step === 3
                  ? "bg-green-100 text-green-700"
                  : order.step === 2
                  ? "bg-blue-100 text-blue-700"
                  : order.step === 1
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700";

              // Join all item names
              const itemNames = order.cartItems?.map(item => item.name).join(", ") || "N/A";

              return (
                <tr key={order.orderId || index} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-800">{order.orderId}</td>
                  <td className="py-3 px-4 text-gray-700">{itemNames}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                      {currentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-36 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          order.step === 3
                            ? "bg-green-500"
                            : order.step === 2
                            ? "bg-blue-500"
                            : order.step === 1
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateOrderStep(index, 1)}
                        disabled={order.step === trackingSteps.length - 1}
                        className={`px-2 py-1 text-xs rounded-md border ${
                          order.step === trackingSteps.length - 1
                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-green-600 border-green-400 hover:bg-green-50"
                        }`}
                      >
                        ➡
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackLocationAdminPanel;
