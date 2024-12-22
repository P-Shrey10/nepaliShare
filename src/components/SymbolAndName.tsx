import React, { useState } from "react";
import SymbolAndName from "./SymbolAndName.json";

const AbbreviationTable: React.FC = () => {
  const [search, setSearch] = useState("");

  const abbreviationArray = Object.entries(SymbolAndName);

  const filteredData = abbreviationArray.filter(([key, value]) =>
    key.toLowerCase().includes(search.toLowerCase()) ||
    value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Stock Name Lists
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Stock Name"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                Abbreviation
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                Full Name
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(([abbr, fullName]) => (
                <tr
                  key={abbr}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-gray-800 text-sm font-medium border-t">
                    {abbr}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm border-t">
                    {fullName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="text-center py-6 text-gray-500 text-sm border-t"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AbbreviationTable;