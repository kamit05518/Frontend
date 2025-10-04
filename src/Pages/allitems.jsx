import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const AllItems = ({ items }) => {
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    addToCart(item, quantity);

    const button = document.getElementById(`add-btn-${item._id}`);
    if (button) {
      button.textContent = "✓ Added";
      button.classList.remove("bg-purple-600");
      button.classList.add("bg-green-500");
      setTimeout(() => {
        button.textContent = "Add To Cart";
        button.classList.remove("bg-green-500");
        button.classList.add("bg-purple-600");
      }, 1500);
    }
  };

  if (items.length === 0) {
    return <p className="text-center text-gray-600">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-sm border hover:shadow-md transition group relative"
        >
          {/* Image */}
          <div className="w-full h-[200px] overflow-hidden rounded-t-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => (e.target.src = "")}
            />
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="font-semibold text-md text-gray-800 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {item.description || "Delicious item"}
            </p>

            {/* Price */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">₹{item.price}</span>
              {item.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{item.originalPrice}
                </span>
              )}
            </div>

            {/* Discount Badge */}
            {item.discount && (
              <div className="absolute top-2 right-2 bg-green-700 text-white text-[13px] px-2 py-0.5 rounded-full shadow">
                {item.discount}% OFF
              </div>
            )}

            {/* Quantity + Add To Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, (quantities[item._id] || 1) - 1)
                  }
                  className="w-7 h-7 flex items-center justify-center bg-gray-200 text-xl rounded-full hover:bg-gray-300 transition"
                >
                  −
                </button>
                <span className="w-6 text-center text-md font-medium">
                  {quantities[item._id] || 1}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, (quantities[item._id] || 1) + 1)
                  }
                  className="w-7 h-7 flex items-center justify-center bg-gray-200 text-xl rounded-full hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

              <button
                id={`add-btn-${item._id}`}
                onClick={() => handleAddToCart(item)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-red-700 transition-all duration-300"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllItems;
