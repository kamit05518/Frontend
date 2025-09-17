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
      const response = await axios.get("http://localhost:5001/api/categories");
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/items");
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
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mt-20 mb-6">Menu</h2>

      {/* SearchBar */}
      <div className="max-w-md mx-auto mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className={`cursor-pointer p-4 rounded-lg shadow-md transition transform hover:scale-105 ${
              selectedCategory?._id === cat._id
                ? "bg-rose-200 ring-2 ring-rose-500"
                : "bg-gray-100"
            }`}
          >
            <img
              src={cat.image || "/default-category.png"}
              alt={cat.name}
              className="w-20 h-20 object-cover rounded-full mb-2"
            />
            <p className="text-center font-medium">{cat.name}</p>
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

      {/* If subcategory is selected, show specific items */}
      {selectedSubcategory ? (
        <Items
          subcategoryId={selectedSubcategory._id}
          subcategoryName={selectedSubcategory.name}
        />
      ) : (
        // If no subcategory selected, show all filtered items
        <div className="container mx-auto">
          <AllItems items={filteredItems} />
        </div>
      )}
    </div>
  );
};

export default Menu;
