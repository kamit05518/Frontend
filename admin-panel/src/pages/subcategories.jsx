import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Get token from localStorage (or your auth provider)
const token = localStorage.getItem("token");

// Create axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const Subcategories = () => {
  // States
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    image: null,
    category: "",
  });

  const [editingSubcategory, setEditingSubcategory] = useState({
    _id: "",
    name: "",
    image: null,
    existingImage: "",
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/subcategories");
      setSubcategories(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories/categories");
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  // Delete subcategory
  const handleDelete = async (id) => {
    if (window.confirm("Delete this subcategory?")) {
      try {
        await axiosInstance.delete(`/subcategories/${id}`);
        toast.success("Subcategory deleted");
        // After delete, refresh list and reset to first page if needed
        fetchSubcategories();
        setCurrentPage(1);
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // Add subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategory.name) return toast.warning("Enter subcategory name");
    if (!newSubcategory.category) return toast.warning("Select a category");

    const formData = new FormData();
    formData.append("name", newSubcategory.name);
    formData.append("category", newSubcategory.category);
    if (newSubcategory.image) formData.append("image", newSubcategory.image);

    try {
      await axiosInstance.post("/subcategories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Subcategory added");
      setNewSubcategory({ name: "", image: null, category: "" });
      setShowModal(false);
      fetchSubcategories();
      setCurrentPage(1);
    } catch (err) {
      toast.error("Error adding subcategory");
    }
  };

  // Edit subcategory
  const handleEditSubcategory = async () => {
    if (!editingSubcategory.name)
      return toast.warning("Enter subcategory name");
    if (!editingSubcategory.category)
      return toast.warning("Select a category");

    const formData = new FormData();
    formData.append("name", editingSubcategory.name);
    formData.append("category", editingSubcategory.category);
    if (editingSubcategory.image) formData.append("image", editingSubcategory.image);

    try {
      await axiosInstance.put(`/subcategories/${editingSubcategory._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Subcategory updated");
      setEditingSubcategory({
        _id: "",
        name: "",
        image: null,
        existingImage: "",
        category: "",
      });
      setShowEditModal(false);
      fetchSubcategories();
    } catch (err) {
      toast.error("Error updating subcategory");
    }
  };

  // Open edit modal with pre-filled data
  const openEditModal = (subcategory) => {
    setEditingSubcategory({
      _id: subcategory._id,
      name: subcategory.name,
      image: null,
      existingImage: subcategory.image,
      category: subcategory.category?._id || subcategory.category || "",
    });
    setShowEditModal(true);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subcategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  // Get category name to display
  const getCategoryName = (subcategory) => {
    if (typeof subcategory.category === "object" && subcategory.category) {
      return subcategory.category.name;
    }
    const cat = categories.find((c) => c._id === subcategory.category);
    return cat ? cat.name : "N/A";
  };

  // Initial fetch
  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-[#e3e4eb] min-h-screen pb-24">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">📂 Food Subcategories</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Subcategory
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading subcategories...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded border border-gray-600">
          <table className="w-full text-left">
            <thead className="bg-[#182459] text-white">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Edit</th>
                <th className="p-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-t border-gray-700 hover:bg-slate-400"
                >
                  <td className="p-3">
                    {sub.image ? (
                      <img
                        src={
                          sub.image.startsWith("http")
                            ? sub.image
                            : `http://localhost:5000/${sub.image}`
                        }
                        alt={sub.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="p-3 font-medium text-black">{sub.name}</td>
                  <td className="p-3 text-black">{getCategoryName(sub)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="bg-green-600 text-white px-3 py-2 rounded w-full"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded w-full"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-600">
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {subcategories.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-[#171f57] p-4 flex justify-center items-center gap-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded text-white bg-blue-700 disabled:bg-gray-500"
          >
            Prev
          </button>
          <span className="text-white font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded text-white bg-blue-700 disabled:bg-gray-500"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#223170] p-6 rounded w-full max-w-md text-white">
            <h3 className="text-xl font-semibold mb-4">Add Subcategory</h3>

            <select
              value={newSubcategory.category}
              onChange={(e) =>
                setNewSubcategory({ ...newSubcategory, category: e.target.value })
              }
              className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500 mb-3"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={newSubcategory.name}
              onChange={(e) =>
                setNewSubcategory({ ...newSubcategory, name: e.target.value })
              }
              className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500 mb-3"
              placeholder="Subcategory name"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewSubcategory({ ...newSubcategory, image: e.target.files[0] })
              }
              className="w-full text-white mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubcategory}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#223170] p-6 rounded w-full max-w-md text-white">
            <h3 className="text-xl font-semibold mb-4">Edit Subcategory</h3>

            <select
              value={editingSubcategory.category}
              onChange={(e) =>
                setEditingSubcategory({
                  ...editingSubcategory,
                  category: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500 mb-3"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={editingSubcategory.name}
              onChange={(e) =>
                setEditingSubcategory({
                  ...editingSubcategory,
                  name: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500 mb-3"
            />

            {editingSubcategory.existingImage && (
              <img
                src={
                  editingSubcategory.existingImage.startsWith("http")
                    ? editingSubcategory.existingImage
                    : `http://localhost:5000/${editingSubcategory.existingImage}`
                }
                alt="Current"
                className="w-20 h-20 object-cover rounded mb-2"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditingSubcategory({
                  ...editingSubcategory,
                  image: e.target.files[0],
                })
              }
              className="w-full text-white mb-2"
            />
            <p className="text-xs text-gray-400 mb-3">
              Leave empty to keep current image
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubcategory}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategories;
