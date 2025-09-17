import React, { useEffect, useState } from "react";

const paymentSteps = ["Initiated", "Processing", "Verified", "Successful"];

const initialPayments = [
  {
    id: "ORD001",
    name: "Rahul Sharma",
    to: "SpiceHub",
    amount: 450,
    ref: "GPay123456",
    upi: "rahul@upi",
    step: 0,
  },
  {
    id: "ORD002",
    name: "Anjali Mehra",
    to: "Biryani Point",
    amount: 620,
    ref: "GPay987654",
    upi: "anjali@upi",
    step: 0,
  },
  {
    id: "ORD003",
    name: "Vikram Patel",
    to: "Tandoori Express",
    amount: 250,
    ref: "GPay456789",
    upi: "vikram@upi",
    step: 0,
  },
];

const statusColors = {
  Initiated: "bg-gray-200 text-gray-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Verified: "bg-blue-100 text-blue-700",
  Successful: "bg-green-100 text-green-700",
};

const PaymentStatusTable = () => {
  const [payments, setPayments] = useState(initialPayments);

  useEffect(() => {
    const interval = setInterval(() => {
      setPayments((prev) =>
        prev.map((p) => ({
          ...p,
          step: p.step < paymentSteps.length - 1 ? p.step + 1 : p.step,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🧾 Payment Status</h2>

        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Payee</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">UPI ID</th>
              <th className="py-3 px-4">Ref No.</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((payment, idx) => {
              const currentStatus = paymentSteps[payment.step];

              return (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-800">{payment.id}</td>
                  <td className="py-3 px-4">{payment.name}</td>
                  <td className="py-3 px-4">{payment.to}</td>
                  <td className="py-3 px-4 font-semibold">₹{payment.amount}</td>
                  <td className="py-3 px-4">{payment.upi}</td>
                  <td className="py-3 px-4">{payment.ref}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[currentStatus]} ${
                        currentStatus === "Processing" ? "animate-pulse" : ""
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-36 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          payment.step === 3
                            ? "bg-green-500"
                            : payment.step === 2
                            ? "bg-blue-500"
                            : payment.step === 1
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                        }`}
                        style={{
                          width: `${((payment.step + 1) / paymentSteps.length) * 100}%`,
                          transition: "width 1s ease-in-out",
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentStatusTable;
