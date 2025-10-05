import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Subcategories = ({ categoryId, selectedSubcategory, onSubcategoryClick }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubcategories = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5001/api/subcategories/category/${id}`
      );
      setSubcategories(response.data.subcategories || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch subcategories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories(categoryId);
  }, [categoryId]);

  if (loading) return <p className="text-center">Loading subcategories...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mb-8"
      >
        {subcategories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6 p-4">
            {subcategories.map((subcat) => (
              <motion.div
                key={subcat._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSubcategoryClick(subcat)}
                className={`flex flex-col items-center cursor-pointer ${
                  selectedSubcategory?._id === subcat._id
                    ? ""
                    : ""
                }`}
              >
                <div className="rounded-full overflow-hidden w-20 h-20 border-4 border-transparent hover:border-purple-600">
                  <img
                    src={subcat.image || "/default-subcategory.png"}
                    alt={subcat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="mt-2 text-sm font-medium text-gray-800 text-center">
                  {subcat.name}
                </h2>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No subcategories found for this category.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Subcategories;
