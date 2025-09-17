import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SwiggyProfile = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const [originalForm, setOriginalForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load profile data from API/localStorage on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Simulate API call to fetch profile data
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/profile');
      // const data = await response.json();
      
      // Simulating API response with timeout
      setTimeout(() => {
        const mockProfileData = {
          fullName: "Rahul Sharma",
          email: "rahul.sharma@example.com",
          phone: "9876543210",
          dob: "1990-05-15",
          gender: "Male"
        };
        
        setForm(mockProfileData);
        setOriginalForm(mockProfileData);
        setIsDataLoaded(true);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to load profile data");
      setLoading(false);
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";

    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!form.dob.trim()) newErrors.dob = "Date of Birth is required";
    if (!form.gender.trim()) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(form),
      // });
      
      // Simulating API call with timeout
      setTimeout(() => {
        // Save to localStorage as fallback
        localStorage.setItem('swiggyProfile', JSON.stringify(form));
        
        setOriginalForm(form);
        setIsEditing(false);
        setLoading(false);
        toast.success("Profile saved successfully!");
      }, 1500);
    } catch (error) {
      toast.error("Failed to save profile");
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    if (!isEditing) return;
    
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel editing - revert to original values
      setForm(originalForm);
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  // Check if form has been modified
  const isFormModified = () => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-10 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 tracking-wide">
            Your Profile
          </h2>
          <button
            type="button"
            onClick={toggleEdit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold ${
              isEditing 
                ? "bg-gray-500 hover:bg-gray-600 text-white" 
                : "bg-orange-500 hover:bg-orange-600 text-white"
            } transition-colors`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            {
              id: "fullName",
              label: "Full Name",
              type: "text",
              placeholder: "Enter your full name",
              value: form.fullName,
              error: errors.fullName,
              disabled: !isEditing
            },
            {
              id: "email",
              label: "Email",
              type: "email",
              placeholder: "Enter your email",
              value: form.email,
              error: errors.email,
              disabled: !isEditing
            },
            {
              id: "phone",
              label: "Phone",
              type: "tel",
              placeholder: "Enter 10 digit phone number",
              value: form.phone,
              maxLength: 10,
              error: errors.phone,
              disabled: !isEditing
            },
            {
              id: "dob",
              label: "Date of Birth",
              type: "date",
              value: form.dob,
              error: errors.dob,
              disabled: !isEditing
            },
          ].map(({ id, label, type, placeholder, value, maxLength, error, disabled }) => (
            <div key={id} className="mb-6">
              <label htmlFor={id} className="block text-gray-700 font-semibold mb-2">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                value={value}
                maxLength={maxLength}
                placeholder={placeholder}
                aria-invalid={error ? "true" : "false"}
                onChange={handleChange}
                disabled={disabled || loading}
                className={`w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                  error ? "border-red-500" : "border-gray-300"
                } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
              )}
            </div>
          ))}

          {/* Gender Select */}
          <div className="mb-8">
            <label htmlFor="gender" className="block text-gray-700 font-semibold mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              aria-invalid={errors.gender ? "true" : "false"}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={`w-full border rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1 font-medium">{errors.gender}</p>
            )}
          </div>

          {/* Submit Button */}
          {isEditing && (
            <button
              type="submit"
              disabled={loading || !isFormModified()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-shadow shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-400"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          )}
        </form>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default SwiggyProfile;