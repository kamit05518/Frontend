import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactMessagesTable = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contact");
      setMessages(response.data);
    } catch (error) {
      toast.error("Error fetching contact messages");
      console.error("Error fetching contact messages:", error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to delete message");
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = messages.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="relative bg-[#eeeef2] text-black min-h-screen p-6 pb-28">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-6">📩 Contact Submissions</h2>

      {/* TABLE VIEW for md and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-600 rounded">
          <thead className="bg-[#162153]">
            <tr className="text-left text-white text-sm">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((msg) => (
              <tr
                key={msg._id}
                className="border-t border-gray-700 hover:bg-[#8f96ba] transition duration-200"
              >
                <td className="p-3 font-medium">{msg.name}</td>
                <td className="p-3 text-blue-600">{msg.email}</td>
                <td className="p-3">{msg.message}</td>
                <td className="p-3 text-black">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No contact messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW for small screens */}
      <div className="md:hidden flex flex-col gap-4">
        {currentItems.length === 0 && (
          <p className="text-center py-6 text-gray-400">No contact messages found.</p>
        )}
        {currentItems.map((msg) => (
          <div
            key={msg._id}
            className="bg-[#223170] p-4 rounded shadow flex flex-col space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{msg.name}</h3>
              <button
                onClick={() => deleteMessage(msg._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
            <p className="text-blue-300 break-all"><strong>Email:</strong> {msg.email}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p className="text-gray-300 text-sm">
              <strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Fixed Pagination */}
      <div className="fixed bottom-0 left-0 w-full bg-[#121a4e] border-t border-gray-600 py-4 px-6 flex justify-center items-center gap-4 z-50">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded font-medium ${
            currentPage === 1
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          &laquo; Prev
        </button>

        <span className="text-white font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded font-medium ${
            currentPage === totalPages
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default ContactMessagesTable;
