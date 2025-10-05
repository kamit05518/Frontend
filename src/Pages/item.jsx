import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Items = ({ subcategoryId, subcategoryName }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});

  const { addToCart } = useCart();

  const API_BASE_URL = "http://localhost:5001";

  const fetchItems = async (id) => {
    if (!id) {
      setItems([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/items/subcategory/${id}`,
        { timeout: 5000 }
      );

      let itemsData = [];
      if (Array.isArray(response.data)) {
        itemsData = response.data;
      } else if (response.data?.items) {
        itemsData = response.data.items;
      } else if (response.data?.data) {
        itemsData = response.data.data;
      }

      setItems(itemsData);

      const initialQuantities = {};
      itemsData.forEach((item) => {
        initialQuantities[item._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("API Error:", err);
      setError(`Error: ${err.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subcategoryId) {
      fetchItems(subcategoryId);
    }
  }, [subcategoryId]);

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-3 animate-pulse"
          >
            <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
            <div className="bg-gray-200 h-3 rounded mb-1"></div>
            <div className="bg-gray-200 h-3 rounded w-2/3 mb-2"></div>
            <div className="bg-gray-200 h-5 rounded w-1/3 mb-2"></div>
            <div className="bg-gray-200 h-8 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      {subcategoryName && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">{subcategoryName}</h2>
          <p className="text-gray-600 text-sm">{items.length} items</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group relative"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-md mb-1 line-clamp-1">
                  {item.name}
                </h3>

                <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
                  {item.description || "Delicious item prepared with care"}
                </p>

                {item.subcategory?.name && (
                  <p className="text-[11px] text-blue-600 font-medium mb-1">
                    Category: {item.subcategory.name}
                  </p>
                )}

                {item.time && (
                  <p className="text-[11px] text-gray-500 mb-2">
                    ⏱ {item.time} min
                  </p>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-base font-bold text-gray-800">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-500 line-through ml-1">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {item.isVeg !== undefined && (
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center ${
                        item.isVeg ? "border-green-600" : "border-red-600"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? "bg-green-600" : "bg-red-600"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Quantity + Add button */}
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-1.5 ">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          (quantities[item._id] || 1) - 1
                        )
                      }
                      className="w-7 h-7 flex items-center justify-center bg-gray-200 text-lg rounded-full hover:bg-gray-300 transition"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium text-gray-800 text-md">
                      {quantities[item._id] || 1}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          (quantities[item._id] || 1) + 1
                        )
                      }
                      className="w-7 h-7 flex items-center justify-center bg-gray-200 text-lg rounded-full hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    id={`add-btn-${item._id}`}
                    onClick={() => handleAddToCart(item)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-purple-700 transition-all duration-300"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>

              {/* Badges */}
              {item.isPopular && (
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Popular
                </div>
              )}
              {item.discount && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-[13px] px-2 py-0.5 rounded-full shadow">
                  {item.discount}% OFF
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        subcategoryId &&
        !loading && (
          <div className="text-center bg-white rounded-xl p-8 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              No items found
            </h4>
            <p className="text-gray-600 text-sm mb-3">
              No items available for{" "}
              <strong>{subcategoryName || "this category"}</strong> yet.
            </p>
            <button
              onClick={() => fetchItems(subcategoryId)}
              className="bg-purple-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-purple-700 transition-all"
            >
              Refresh
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Items;
