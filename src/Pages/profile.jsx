import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    profileImage: null, 
  });

  const [originalForm, setOriginalForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); 

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/profile");
      const data = response.data;

      setForm({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        dob: data.dob || "",
        gender: data.gender || "",
        profileImage: null,
      });

      setOriginalForm({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        dob: data.dob || "",
        gender: data.gender || "",
        profileImage: null,
      });

      setPreviewImage(data.profileImage ? `http://localhost:5001${data.profileImage}` : null);

      setIsDataLoaded(true);
    } catch (error) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!form.dob.trim()) newErrors.dob = "Date of Birth is required";
    if (!form.gender.trim()) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("dob", form.dob);
      formData.append("gender", form.gender);
      if (form.profileImage) formData.append("profileImage", form.profileImage);

      await axios.post("http://localhost:5001/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOriginalForm(form);
      setIsEditing(false);
      toast.success("Profile saved successfully!");
      fetchProfileData();
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files[0];
      if (file) {
        setForm({ ...form, profileImage: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const toggleEdit = () => {
    if (isEditing) {
      setForm(originalForm);
      fetchProfileData();
    }
    setIsEditing(!isEditing);
  };

  const isFormModified = () => {
    return JSON.stringify(form) !== JSON.stringify(originalForm) || form.profileImage !== null;
  };

  if (!isDataLoaded && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
          <button
            type="button"
            onClick={toggleEdit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isEditing ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-orange-500 shadow-md">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-center mb-6">
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {["fullName", "email", "phone", "dob"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                {field === "dob" ? "Date of Birth" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "dob" ? "date" : field === "phone" ? "tel" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className={`w-full border rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={`w-full border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={loading || !isFormModified()}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-shadow shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-400"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
