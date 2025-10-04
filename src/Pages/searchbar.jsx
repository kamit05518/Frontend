import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="🔍 Search for food..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md px-6 py-3 border border-gray-300 rounded-full shadow-md 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
      />
    </div>
  );
};

export default SearchBar;
