import React, { useState, useEffect } from "react";
import axios from "axios";
import Subcategories from "./subcategories";
import Items from "./item";
import AllItems from "./allitems";
import SearchBar from "./searchbar";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://backend-1mxo.onrender.com/api/categories");
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      const response = await axios.get("https://backend-1mxo.onrender.com/api/items");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.items || response.data.data || [];

      setAllItems(data);
    } catch (err) {
      console.error("Error fetching all items:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllItems();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  // Filter items for search bar
  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 min-h-screen py-10 px-4 sm:px-6 md:px-12 lg:px-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-purple-800 mt-10 mb-8">
        Menu
      </h2>

      {/* SearchBar */}
      <div className="max-w-md mx-auto mb-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className={`cursor-pointer p-4 sm:p-5 md:p-6 rounded-xl shadow-md transition transform hover:scale-105 
              ${
                selectedCategory?._id === cat._id
                  ? "bg-purple-300 ring-2 ring-purple-600"
                  : "bg-purple-50 hover:bg-purple-100"
              }`}
          >
            <img
              src={cat.image || "/default-category.png"}
              alt={cat.name}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-full mb-2 border-2 border-purple-200"
            />
            <p className="text-center font-semibold text-sm sm:text-base md:text-lg text-purple-800">
              {cat.name}
            </p>
          </div>
        ))}
      </div>

      {/* Subcategories */}
      {selectedCategory && (
        <Subcategories
          categoryId={selectedCategory._id}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryClick={handleSubcategoryClick}
        />
      )}

      {/* Items */}
      {selectedSubcategory ? (
        <Items
          subcategoryId={selectedSubcategory._id}
          subcategoryName={selectedSubcategory.name}
        />
      ) : (
        <div className="container mx-auto">
          <AllItems items={filteredItems} />
        </div>
      )}
    </section>
  );
};

export default Menu;
