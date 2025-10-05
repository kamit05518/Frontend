import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaKey, FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";

  const [email] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out" });
    message.config({ top: 100, duration: 2, maxCount: 1 });

    if (!emailFromState) {
      message.error("Email not found, please start from Forgot Password page");
      navigate("/forgot-password");
    }
  }, [emailFromState, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      message.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.message || "Error resetting password");
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

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40 transform transition-all hover:shadow-pink-300 hover:-translate-y-1 duration-300"
        data-aos="zoom-in"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-5">
          <p className="text-center text-gray-800">
            Reset password for <b>{email}</b>
          </p>

          {/* OTP */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
              <FaKey />
            </span>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white/70 text-gray-800 placeholder-gray-500 shadow-inner border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
              <FaLock />
            </span>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white/70 text-gray-800 placeholder-gray-500 shadow-inner border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Button styled like Login button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 shadow-md"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-4">
          Back to{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
