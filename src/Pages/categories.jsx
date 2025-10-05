import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Categories = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://backend-1mxo.onrender.com/api/categories");

      console.log("Categories API Response:", response.data);

      let categoriesData = [];
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (
        response.data.categories &&
        Array.isArray(response.data.categories)
      ) {
        categoriesData = response.data.categories;
      } else if (
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        categoriesData = response.data.data;
      } else {
        console.warn("Unexpected API response format:", response.data);
      }

      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
      console.error("Error fetching categories:", err);
      if (err.response) {
        console.error(
          "Error response:",
          err.response.status,
          err.response.data
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 animate-pulse">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchCategories}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-wrap justify-center gap-6 p-4"
      >
        {categories.length > 0 ? (
          categories.map((cat) => (
            <motion.div
              key={cat._id || cat.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onCategoryClick(cat)}
            >
              {/* Round Image */}
              <img
                src={cat.image || "/default-category.png"}
                alt={cat.name}
                className="w-28 h-28 object-cover rounded-full border-2 border-transparent hover:border-purple-500 transition-all duration-300"
                onError={(e) => {
                  e.target.src = "/default-category.png";
                }}
              />

              {/* Category Name */}
              <h2 className="mt-2 text-base font-medium text-gray-800">
                {cat.name}
              </h2>
            </motion.div>
          ))
        ) : (
          <div className="text-center w-full py-10">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Categories;
