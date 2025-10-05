import React, { useState } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://backend-1mxo.onrender.com/api/auth/forgot-password', { email });

      message.success(res.data.message || 'OTP sent to your email');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      message.error(error.response?.data?.message || 'Error sending OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-400">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
              <FaUser />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 shadow-md"
          >
            Send OTP
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Remembered your password?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
