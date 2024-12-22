import React, { useEffect, useState } from "react";
import axios from "axios";

interface TurnoverDetail {
  s: string;
  n: string;
  lp: number;
  t: number;
  pc: number;
  h: number;
  l: number;
  op: number;
  q: number;
}

interface MarketSummaryData {
  mt: string;
  overall: Record<string, unknown>;
  turnover: {
    date: string;
    detail: TurnoverDetail[];
  };
}

const MarketSummary: React.FC = () => {
  const [stockData, setStockData] = useState<MarketSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ascending, setAscending] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    axios
      .get(
        "https://merolagani.com/handlers/webrequesthandler.ashx?type=market_summary"
      )
      .then((response) => {
        setStockData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      });
  }, []);

  const toggleSortOrder = () => {
    setAscending((prev) => !prev);
  };

  const filteredAndSortedData = stockData?.turnover.detail
    .filter((item) => {
      if (filter === "profit") return item.pc > 0;
      if (filter === "loss") return item.pc < 0;
      if (filter === "neutral") return item.pc === 0;
      return true;
    })
    .filter((item) => item.s.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (ascending) {
        return a.s.localeCompare(b.s);
      } else {
        return b.s.localeCompare(a.s);
      }
    });

  const getPercentageChangeClass = (pc: number) => {
    if (pc < 0) return "text-red-500";
    if (pc === 0) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <div className="market-summary p-4 max-w-7xl mx-auto">
      {loading ? (
        <div className="loading-spinner text-center text-lg">Loading...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Market Details
          </h2>
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search by Stock Symbol"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded shadow-sm w-full sm:w-1/2"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded shadow-sm w-full sm:w-1/4"
            >
              <option value="all">All</option>
              <option value="profit">Profit</option>
              <option value="loss">Loss</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
            <thead>
              <tr className="border-b bg-gray-100">
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={toggleSortOrder}
                >
                  Stock Symbol {ascending ? "▲" : "▼"}
                </th>
                <th className="px-4 py-2 text-left">Last Price (LP)</th>
                <th className="px-4 py-2 text-left">Turnover</th>
                <th className="px-4 py-2 text-left">Percentage Change</th>
                <th className="px-4 py-2 text-left">High</th>
                <th className="px-4 py-2 text-left">Low</th>
                <th className="px-4 py-2 text-left">Opening Price (OP)</th>
                <th className="px-4 py-2 text-left">Quantity (Q)</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{item.s}</td>
                  <td className="px-4 py-2">{item.lp.toFixed(2)}</td>
                  <td className="px-4 py-2">{item.t.toFixed(2)}</td>
                  <td
                    className={`px-4 py-2 ${getPercentageChangeClass(item.pc)}`}
                  >
                    {item.pc}%
                  </td>
                  <td className="px-4 py-2">{item.h}</td>
                  <td className="px-4 py-2">{item.l}</td>
                  <td className="px-4 py-2">{item.op}</td>
                  <td className="px-4 py-2">{item.q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketSummary;
