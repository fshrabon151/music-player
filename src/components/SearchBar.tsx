import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for music..."
        className="p-2 w-64 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
