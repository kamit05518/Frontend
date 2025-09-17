import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: null });
  const [editingCategory, setEditingCategory] = useState({ 
    _id: "", name: "", image: null, existingImage: "" 
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper to get token from localStorage
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/categories/categories",
        { headers: getAuthHeaders() }
      );
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/categories/categories/${id}`, 
          { headers: getAuthHeaders() }
        );
        toast.success("Category deleted");
        fetchCategories();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) return toast.warning("Enter category name");

    const formData = new FormData();
    formData.append("name", newCategory.name);
    if (newCategory.image) formData.append("image", newCategory.image);

    try {
      await axios.post(
        "http://localhost:5000/api/categories/categories",
        formData,
        { headers: getAuthHeaders() } 
      );
      toast.success("Category added");
      setNewCategory({ name: "", image: null });
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error("Error adding category");
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory.name) return toast.warning("Enter category name");

    const formData = new FormData();
    formData.append("name", editingCategory.name);
    if (editingCategory.image) formData.append("image", editingCategory.image);

    try {
      await axios.put(
        `http://localhost:5000/api/categories/categories/${editingCategory._id}`,
        formData,
        { headers: getAuthHeaders() } // NO Content-Type here
      );
      toast.success("Category updated");
      setEditingCategory({ _id: "", name: "", image: null, existingImage: "" });
      setShowEditModal(false);
      fetchCategories();
    } catch (err) {
      toast.error("Error updating category");
    }
  };

  const openEditModal = (category) => {
    setEditingCategory({
      _id: category._id,
      name: category.name,
      image: null,
      existingImage: category.image
    });
    setShowEditModal(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  return (
    <div className="p-6 bg-[#e3e4eb] min-h-screen pb-24">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">📁 Food Categories</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Category
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
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
                <th className="p-3">Edit</th>
                <th className="p-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-700 hover:bg-slate-400">
                  <td className="p-3">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-14 h-14 object-cover rounded" />
                    ) : "No Image"}
                  </td>
                  <td className="p-3 font-medium text-black">{cat.name}</td>
                  <td className="p-3">
                    <button onClick={() => openEditModal(cat)} className="bg-green-600 text-white px-3 py-2 rounded w-full">
                      Edit
                    </button>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(cat._id)} className="bg-red-600 text-white px-3 py-2 rounded w-full">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-600">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {categories.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-[#171f57] p-4 flex justify-center items-center gap-4">
          <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 rounded text-white bg-blue-700 disabled:bg-gray-500">
            Prev
          </button>
          <span className="text-white font-medium">Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 rounded text-white bg-blue-700 disabled:bg-gray-500">
            Next
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#223170] p-6 rounded w-full max-w-md text-white">
            <h3 className="text-xl font-semibold mb-4">Add Category</h3>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500 mb-3"
              placeholder="Category name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })}
              className="w-full text-white mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddCategory} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#223170] p-6 rounded w-full max-w-md text-white">
            <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500 mb-3"
            />
            {editingCategory.existingImage && (
              <img src={editingCategory.existingImage} alt="Current" className="w-20 h-20 object-cover rounded mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.files[0] })}
              className="w-full text-white mb-2"
            />
            <p className="text-xs text-gray-400 mb-3">Leave empty to keep current image</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleEditCategory} className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
