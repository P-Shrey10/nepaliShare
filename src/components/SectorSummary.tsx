import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

interface SectorData {
  s: string;
  t: number;
  q: number;
}

const SectorSummary: React.FC = () => {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SectorData;
    direction: "asc" | "desc";
  }>({
    key: "s",
    direction: "asc",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    axios
      .get(
        "https://merolagani.com/handlers/webrequesthandler.ashx?type=market_summary"
      )
      .then((response) => {
        const data = response.data.sector.detail;
        setSectorData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching sector data");
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    return sectorData.filter((sector) =>
      sector.s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sectorData, searchQuery]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof SectorData) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="overflow-x-auto p-6 max-w-screen-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Sector Data</h2>
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/3"
          placeholder="Search by sector"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <div className="text-center py-4">Loading data...</div>}

      {error && <div className="text-center py-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th
                className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-700"
                onClick={() => handleSort("s")}
                aria-label={`Sort by Sector ${
                  sortConfig.direction === "asc" ? "ascending" : "descending"
                }`}
              >
                Sector
                {sortConfig.key === "s" &&
                  (sortConfig.direction === "asc" ? " ▲" : " ▼")}
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-700"
                onClick={() => handleSort("t")}
                aria-label={`Sort by Total ${
                  sortConfig.direction === "asc" ? "ascending" : "descending"
                }`}
              >
                Total (in billions)
                {sortConfig.key === "t" &&
                  (sortConfig.direction === "asc" ? " ▲" : " ▼")}
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left font-semibold text-gray-700"
                onClick={() => handleSort("q")}
                aria-label={`Sort by Quantity ${
                  sortConfig.direction === "asc" ? "ascending" : "descending"
                }`}
              >
                Quantity
                {sortConfig.key === "q" &&
                  (sortConfig.direction === "asc" ? " ▲" : " ▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((sector, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-gray-100" : ""
                }`}
              >
                <td className="px-6 py-3 text-gray-700">{sector.s}</td>
                <td className="px-6 py-3 text-gray-700">
                  {sector.t.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {sector.q.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SectorSummary;
