import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { message } from 'antd';
import { AuthContext } from "../context/Authcontext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out" });

    message.config({
      top: 100,
      duration: 2,
      maxCount: 1,
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      if (res.data && res.data.user && res.data.token) {
        message.success(res.data.message || "Login successful");

        localStorage.setItem("token", res.data.token);

        login(res.data.user, res.data.token);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        message.error("Something went wrong.");
      }

    } catch (err) {
      console.error("Login error:", err);
      message.error(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 overflow-hidden p-6">
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-20 left-10" />
        <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-40 right-10" />
        <div className="absolute w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse bottom-10 left-40" />
      </div>

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40 hover:shadow-pink-300 transition-transform duration-300 transform hover:-translate-y-1 text-gray-800"
        data-aos="zoom-in"
      >
        {/* ✖ Close */}
        <div className="text-right">
          <button
            onClick={() => navigate('/')}
            className="text-pink-500 text-2xl hover:scale-125 transition-transform font-bold"
          >
            &times;
          </button>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-white/70 rounded-lg text-gray-800 placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-white/70 rounded-lg text-gray-800 placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition duration-300 py-2 rounded-md font-semibold text-white shadow-md"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-pink-600 hover:text-purple-600 transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* ✅ Register Link */}
          <div className="text-center mt-2">
            <span className="text-sm text-gray-700">Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/registeration')}
              className="text-sm text-pink-600 hover:text-purple-600 font-medium transition"
            >
              Register Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
