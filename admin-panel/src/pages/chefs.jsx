import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChefManager = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", specialty: "", image: null });
  const [editForm, setEditForm] = useState({ id: "", name: "", specialty: "", image: null });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchChefs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/chefs");
      setChefs(res.data);
    } catch (err) {
      toast.error("Failed to fetch chefs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleAddChef = async () => {
    if (!form.name || !form.specialty || !form.image) {
      toast.warning("Please fill all fields including image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("specialty", form.specialty);
    formData.append("image", form.image);

    try {
      await axios.post("http://localhost:5000/api/chefs", formData);
      toast.success("Chef added!");
      setForm({ name: "", specialty: "", image: null });
      setModalOpen(false);
      fetchChefs();
    } catch (err) {
      console.error(err);
      toast.error("Error adding chef");
    }
  };

  const handleEditChef = async () => {
    if (!editForm.name || !editForm.specialty) {
      toast.warning("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("specialty", editForm.specialty);
    if (editForm.image) {
      formData.append("image", editForm.image);
    }

    try {
      await axios.put(`http://localhost:5000/api/chefs/${editForm.id}`, formData);
      toast.success("Chef updated!");
      setEditForm({ id: "", name: "", specialty: "", image: null });
      setEditModalOpen(false);
      fetchChefs();
    } catch (err) {
      console.error(err);
      toast.error("Error updating chef");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this chef?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/chefs/${id}`);
      toast.success("Chef deleted");
      fetchChefs();
    } catch {
      toast.error("Failed to delete chef");
    }
  };

  const openEditModal = (chef) => {
    setEditForm({
      id: chef._id,
      name: chef.name,
      specialty: chef.specialty,
      image: null
    });
    setEditModalOpen(true);
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = chefs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(chefs.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-6 text-black bg-[#e3e4ed] min-h-screen pb-24">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">👨‍🍳 Chef Management</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          + Add Chef
        </button>
      </div>

      {loading ? (
        <p>Loading chefs...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-600 rounded">
            <thead>
              <tr className="bg-[#162153] text-white text-left">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Specialty</th>
                <th className="p-3">Edit</th>
                <th className="p-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((chef) => (
                <tr
                  key={chef._id}
                  className="border-t border-gray-700 hover:bg-slate-400 transition-colors duration-200"
                >
                  <td className="p-3">
                    {chef.image ? (
                      <img
                        src={chef.image}
                        alt="chef"
                        className="w-14 h-14 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="p-3">{chef.name}</td>
                  <td className="p-3">{chef.specialty}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openEditModal(chef)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(chef._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-300">
                    No chefs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="fixed bottom-0 left-0 w-full bg-[#192159] p-4 shadow-md z-40 flex justify-center items-center gap-4 border-t border-gray-700">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          &lt;&lt; Prev
        </button>
        <span className="text-white font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          Next &gt;&gt;
        </button>
      </div>

      {/* Add Chef Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
          <div className="bg-[#223170] p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Add New Chef</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Chef Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              <input
                type="text"
                placeholder="Specialty"
                value={form.specialty}
                onChange={(e) =>
                  setForm({ ...form, specialty: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files[0] })
                }
                className="w-full text-white"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setForm({ name: "", specialty: "", image: null });
                }}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChef}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Add Chef
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Chef Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
          <div className="bg-[#223170] p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Edit Chef</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Chef Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              <input
                type="text"
                placeholder="Specialty"
                value={editForm.specialty}
                onChange={(e) =>
                  setEditForm({ ...editForm, specialty: e.target.value })
                }
                className="w-full p-2 rounded bg-[#1a245e] text-white border border-gray-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.files[0] })
                }
                className="w-full text-white"
              />
              <p className="text-sm text-gray-300">Leave image empty to keep current image</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditForm({ id: "", name: "", specialty: "", image: null });
                }}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditChef}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Update Chef
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefManager;