import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register only the ArcElement and Tooltip (Legend is removed)
ChartJS.register(ArcElement, Tooltip);

const FoodDashboard = () => {
  const data = {
    labels: [
      "Delivered",
      "Pending",
      "Cancelled",
      "Preparing",
      "Out for Delivery"
    ],
    datasets: [
      {
        data: [120, 30, 10, 20, 15],
        backgroundColor: [
          "#10b981", // green - Delivered
          "#facc15", // yellow - Pending
          "#ef4444", // red - Cancelled
          "#3b82f6", // blue - Preparing
          "#8b5cf6"  // purple - Out for Delivery
        ],
        borderWidth: 0,
      },
    ],
  };

  // Calculate percentage for center text
  const totalOrders = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const deliveredPercent = Math.round(
    (data.datasets[0].data[0] / totalOrders) * 100
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Title */}
        <div className="flex items-center mb-6 space-x-3">
          <span className="text-3xl">🍔</span>
          <h2 className="text-2xl font-semibold text-gray-900">
            Order Status Overview
          </h2>
        </div>

        {/* Donut Chart with centered percentage */}
        <div className="relative w-72 h-72 mx-auto mb-8">
          <Doughnut
            data={data}
            options={{
              cutout: "70%",
              plugins: {
                legend: { display: false }, // 👈 hides ChartJS legend
              },
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl font-extrabold text-gray-900 select-none">
              {deliveredPercent}%
            </span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-sm font-medium">
          {data.labels.map((label, idx) => (
            <LegendItem
              key={label}
              label={label}
              color={data.datasets[0].backgroundColor[idx]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ label, color }) => (
  <div className="flex items-center space-x-3">
    <span
      className="w-5 h-5 rounded-md"
      style={{ backgroundColor: color }}
    ></span>
    <span>{label}</span>
  </div>
);

export default FoodDashboard;
