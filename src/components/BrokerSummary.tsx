import React, { useEffect, useState } from "react";
import axios from "axios";

interface SecurityItem {
  b: string;
  n: string;
  p: number | null;
  s: number | null;
  m: number | null;
  t: number | null;
}

interface ApiResponse {
  broker: {
    detail: SecurityItem[];
  };
}

const BrokerSummary: React.FC = () => {
  const [data, setData] = useState<SecurityItem[]>([]);
  const [filteredData, setFilteredData] = useState<SecurityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "https://merolagani.com/handlers/webrequesthandler.ashx?type=market_summary"
        );
        const sortedData = response.data.broker.detail.sort((a, b) => {
          return parseFloat(a.b) - parseFloat(b.b);
        });
        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`Error: ${error.response.status}`);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.b.toLowerCase().includes(search.toLowerCase()) ||
        item.n.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <header className="sticky top-0 bg-white shadow-md px-4 py-4 z-10 flex flex-col md:flex-row md:justify-between md:items-center border rounded-md">
        <h1 className="text-xl font-bold text-center md:text-left">
          Broker List
        </h1>
        <input
          type="text"
          className="mt-4 md:mt-0 md:ml-4 w-full md:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by Broker ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>
      <div className="overflow-x-auto mt-6 border rounded-md">
        <table className="w-full table-auto text-sm border-collapse ">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border">Broker ID</th>
              <th className="px-4 py-2 border">Company Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Shares</th>
              <th className="px-4 py-2 border">Market Value</th>
              <th className="px-4 py-2 border">Turnover</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border">{item.b}</td>
                  <td className="px-4 py-2 border">{item.n}</td>
                  <td className="px-4 py-2 border">
                    {item.p !== null ? item.p.toFixed(2) : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.s !== null ? item.s.toFixed(2) : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.m !== null ? item.m.toFixed(2) : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.t !== null ? item.t.toFixed(2) : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrokerSummary;
