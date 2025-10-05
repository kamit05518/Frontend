import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { AuthContext } from '../context/AuthContext'; 

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext) || {}; 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', form);

      if (res.data?.token && res.data?.user) {
        message.success(res.data.message || 'Login successful');

        // Save token in localStorage
        localStorage.setItem('token', res.data.token);

        // If using AuthContext
        if (login) login(res.data.user, res.data.token);

        navigate('/');
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  const handleGoogleLogin = () => {
    message.info('Google login not implemented yet.');
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-400">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
              <FaUser />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Username or Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
              <FaLock />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-purple-500" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-purple-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        {/* Sign up Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-purple-600 hover:underline"
          >
            Sign up
          </button>
        </p>

        {/* Divider */}
        <div className="my-4 border-t border-gray-300 relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-500">
            or connect with
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-2">
          <button className="text-blue-600 hover:scale-110 transition text-xl">
            <FaFacebook />
          </button>
          <button
            onClick={handleGoogleLogin}
            className="hover:scale-110 transition text-xl"
          >
            <FcGoogle />
          </button>
          <button className="text-black hover:scale-110 transition text-xl">
            <FaGithub />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
