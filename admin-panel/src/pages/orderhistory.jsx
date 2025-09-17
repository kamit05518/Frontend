import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const OrderHistoryAdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orderhistory");
        setOrders(response.data);
        toast.success("Orders loaded successfully ");
      } catch (err) {
        setError("Failed to fetch orders.");
        toast.error("Failed to fetch orders ");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Delete order
  const handleDeleteOrder = async (mongoId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this order?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/orderhistory/${mongoId}`);
      setOrders((prev) => prev.filter((order) => order._id !== mongoId));
      toast.success("Order deleted successfully ");
    } catch (err) {
      toast.error("Failed to delete order ");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 All Orders</h1>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="min-w-full text-sm text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Order ID</th>
                <th className="px-4 py-3 font-medium text-gray-600">Items</th>
                <th className="px-4 py-3 font-medium text-gray-600">Address</th>
                <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-600">Payment</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="px-4 py-3 font-medium text-gray-600">Delivered</th>
                <th className="px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {order.orderId || order._id}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {order.cartItems?.map((item) => item.name).join(", ")}
                  </td>

                  <td className="px-4 py-3 text-gray-600">{order.address}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">₹{order.totalPrice}</td>
                  <td className="px-4 py-3 text-gray-700">{order.paymentMethod}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status] || "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.deliveredAt ? formatDate(order.deliveredAt) : "-"}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryAdminPanel;
