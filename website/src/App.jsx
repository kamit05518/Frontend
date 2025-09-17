import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Menu from "./Pages/Menu";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Footer from "./components/Footer";
import Hero from "./Pages/Hero";

import ForgetPassword from "./Pages/Forget.Password";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import ResetPassword from "./Pages/Reset.Password";
import Payment from "./Pages/Payment";
import Tracking from "./Pages/Tracking";
import Checkout from "./Pages/checkout";
import OrderHistory from "./Pages/orderhistory";
import Profile from "./Pages/profile";
import Homepage from "./Pages/Homepage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./context/AuthContext";


const App = () => (
  <>


     <AuthProvider>
      <CartProvider>
    <Navbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orderhistory" element={<OrderHistory />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Registration" element={<Registration />} />
      
    </Routes>
     <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </AuthProvider>
  </>
);

export default App;
