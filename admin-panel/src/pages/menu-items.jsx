import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    subcategory: "",
    image: null,
    discount: "",
  });
  const [editingItem, setEditingItem] = useState({
    _id: "",
    name: "",
    price: "",
    subcategory: "",
    image: null,
    discount: "",
    existingImage: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch subcategories
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subcategories");
        setSubcategories(res.data);
      } catch {
        toast.error("Failed to load subcategories");
      }
    };

    // Fetch items
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/items");
        setItems(res.data);
      } catch {
        toast.error("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
    fetchItems();
  }, []); // Empty dependency array ensures this runs only once

  // Add Item
  const handleAdd = async () => {
    const { name, price, subcategory, image, discount } = form;
    if (!name || !price || !subcategory || !image) {
      toast.warn("All fields including image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("subcategory", subcategory);
    formData.append("image", image);
    formData.append("discount", discount || 0);

    try {
      await axios.post("http://localhost:5000/api/items", formData);
      toast.success("Item added!");
      setModalOpen(false);
      setForm({ name: "", price: "", subcategory: "", image: null, discount: "" });

      // Refresh items after adding
      const res = await axios.get("http://localhost:5000/api/items");
      setItems(res.data);
    } catch {
      toast.error("Error adding item");
    }
  };

  // Edit Item
  const handleEdit = async () => {
    const { name, price, subcategory, image, discount } = editingItem;
    if (!name || !price || !subcategory) {
      toast.warn("Name, price and subcategory are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("subcategory", subcategory);
    formData.append("discount", discount || 0);
    if (image) formData.append("image", image);

    try {
      await axios.put(`http://localhost:5000/api/items/${editingItem._id}`, formData);
      toast.success("Item updated!");
      setEditModalOpen(false);
      setEditingItem({
        _id: "",
        name: "",
        price: "",
        subcategory: "",
        image: null,
        discount: "",
        existingImage: "",
      });

      // Refresh items after editing
      const res = await axios.get("http://localhost:5000/api/items");
      setItems(res.data);
    } catch {
      toast.error("Error updating item");
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`);
        toast.success("Deleted");

        // Refresh items after deleting
        const res = await axios.get("http://localhost:5000/api/items");
        setItems(res.data);
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      subcategory: item.subcategory?._id || item.subcategory || "",
      discount: item.discount || "",
      image: null,
      existingImage: item.image,
    });
    setEditModalOpen(true);
  };

  // Get subcategory name for display
  const getSubcategoryName = (item) => {
    if (!item.subcategory) return "No subcategory";

    // If subcategory is populated as an object
    if (typeof item.subcategory === 'object' && item.subcategory.name) {
      return item.subcategory.name;
    }
    // If subcategory is just an ID, find the name from subcategories list
    else if (typeof item.subcategory === 'string') {
      const sub = subcategories.find(s => s._id === item.subcategory);
      return sub ? sub.name : "Unknown";
    }

    return "Invalid subcategory";
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  return (
    <div className="p-4 sm:p-6 text-black bg-[#f0f0f2] min-h-screen pb-28">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">🍽️ Item Management</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          + Add Item
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">No items found.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <>
          {/* TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-600 rounded min-w-[800px]">
              <thead>
                <tr className="bg-[#162153] text-white text-left">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Subcategory</th>
                  <th className="p-3">Price (₹)</th>
                  <th className="p-3">Discount (₹)</th>
                  <th className="p-3">Edit</th>
                  <th className="p-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item._id} className="border-t border-gray-700 hover:bg-slate-100">
                    <td className="p-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/56?text=No+Image";
                          }}
                        />

                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">{getSubcategoryName(item)}</td>
                    <td className="p-3">₹{item.price}</td>
                    <td className="p-3">₹{item.discount || 0}</td>
                    <td className="p-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden grid gap-4">
            {currentItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow">
                <div className="flex gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-600">{getSubcategoryName(item)}</p>
                    <div className="flex justify-between mt-2">
                      <span className="font-medium">₹{item.price}</span>
                      {item.discount > 0 && (
                        <span className="text-red-600">Discount: ₹{item.discount}</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-[#223170] p-4 sm:p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Add Item</h3>
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              <input
                type="number"
                min={1}
                placeholder="Price (₹)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              {/* Dropdown for Subcategory */}
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Discount (₹)"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="w-full text-white"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="bg-gray-500 px-4 py-2 rounded text-white">
                Cancel
              </button>
              <button onClick={handleAdd} className="bg-blue-600 px-4 py-2 rounded text-white">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-[#223170] p-4 sm:p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Edit Item</h3>
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              <input
                type="number"
                min={1}
                placeholder="Price (₹)"
                value={editingItem.price}
                onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              {/* Dropdown for Subcategory */}
              <select
                value={editingItem.subcategory}
                onChange={(e) => setEditingItem({ ...editingItem, subcategory: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Discount (₹)"
                value={editingItem.discount}
                onChange={(e) => setEditingItem({ ...editingItem, discount: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              {editingItem.existingImage && (
                <img
                  src={editingItem.existingImage}
                  alt="Current"
                  className="w-20 h-20 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80?text=Image+Error";
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditingItem({ ...editingItem, image: e.target.files[0] })}
                className="w-full text-white"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditModalOpen(false)} className="bg-gray-500 px-4 py-2 rounded text-white">
                Cancel
              </button>
              <button onClick={handleEdit} className="bg-green-600 px-4 py-2 rounded text-white">
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination - Only show if there are items */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-[#19235e] p-3 flex justify-center gap-3 text-white">
          <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-2 rounded bg-blue-700 disabled:bg-gray-500">
            Prev
          </button>
          <span className="flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="px-3 py-2 rounded bg-blue-700 disabled:bg-gray-500">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuItems;