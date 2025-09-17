import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { message } from "antd"; // ✅ Ant Design message

const Register = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    phoneNumber: "",
  });

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out" });
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

    // Optional: Configure message globally
    message.config({
      duration: 2,
      top: 100,
      maxCount: 1,
    });
  }, []);

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      navigate("/");
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, phoneNumber } = form;

    if (!email || !password || !phoneNumber) {
      message.error("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Please enter a valid email address.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      message.error(
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      message.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", form);
      message.success(res.data.message || "Registered successfully!");
      setForm({ email: "", password: "", phoneNumber: "" });

      // ✅ Delay so success message appears on same page
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      message.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 overflow-hidden p-6">
      {/* Floating Bubbles */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-10 left-10" />
        <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-40 right-10" />
        <div className="absolute w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse bottom-10 left-40" />
      </div>

      {/* Form Card */}
      <div
        ref={formRef}
        className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40 hover:shadow-pink-300 transform hover:-translate-y-1 transition-all duration-300"
        data-aos="zoom-in"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-pink-500 text-2xl font-bold hover:scale-125 transition-transform"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 bg-white/70 rounded-lg text-gray-800 placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 bg-white/70 rounded-lg text-gray-800 placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="w-full px-4 py-2 bg-white/70 rounded-lg text-gray-800 placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition duration-300 py-2 rounded-md font-semibold text-white shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
