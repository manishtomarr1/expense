"use client";

import { useState } from "react";

export default function ExpensesFilters({ filters, setFilters, onSearch }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(localFilters);
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm">Category</label>
        <select
          name="category"
          value={localFilters.category}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          {["Food", "Transport", "Entertainment", "Rent"].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm">Date</label>
        <input
          type="date"
          name="date"
          value={localFilters.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-gray-700 text-sm">Search Description</label>
        <input
          type="text"
          name="search"
          value={localFilters.search}
          onChange={handleChange}
          placeholder="Search..."
          className="border p-2 rounded w-full"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Apply Filters
      </button>
    </form>
  );
}
