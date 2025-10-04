import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalPrice, address } = location.state || {};

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      alert("Payment successful!");
      navigate("/tracking", { state: { orderId } });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  if (!orderId) {
    return <p className="text-center mt-10">Invalid payment request.</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Online Payment</h1>
      <p className="mb-2">Order ID: <span className="font-semibold">{orderId}</span></p>
      <p className="mb-4 text-lg text-rose-600">Amount: ₹{totalPrice}</p>
      
      <div className="flex justify-center mb-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/89/UPI-Logo-vector.svg"
          alt="UPI Payment"
          className="w-24 h-24 animate-pulse"
        />
      </div>

      <p className="text-gray-600">Scan this QR code or use UPI ID:</p>
      <p className="text-lg font-bold mb-4">myshop@upi</p>

      <div className="w-40 h-40 mx-auto border p-2 rounded-md shadow-md mb-4">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=myshop@upi&pn=My%20Shop&am="
          alt="QR Code"
          className="w-full h-full"
        />
      </div>

      <p className="text-green-600 font-semibold animate-bounce">Waiting for payment confirmation...</p>
    </div>
  );
};

export default Payment;
