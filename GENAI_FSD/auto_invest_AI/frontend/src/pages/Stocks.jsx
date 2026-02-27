import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import StockTable from "../components/StockTable";
import { fetchPortfolio, fetchStocks, searchStocks } from "../api/stocks";

export default function Stocks() {
  const [searchParams] = useSearchParams();
  const portfolioId = searchParams.get("portfolio");

  const [portfolios, setPortfolios] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPortfolio = useMemo(
    () => portfolios.find((item) => String(item.id) === String(portfolioId)) || null,
    [portfolios, portfolioId]
  );

  const peChartData = useMemo(
    () =>
      stocks.map((stock) => ({
        symbol: stock.symbol,
        pe_ratio: Number(stock.pe_ratio || 0),
      })),
    [stocks]
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [portfolioData, stockData] = await Promise.all([
          fetchPortfolio(),
          fetchStocks(portfolioId),
        ]);
        const normalizedStocks = Array.isArray(stockData) ? stockData : [];

        setPortfolios(Array.isArray(portfolioData) ? portfolioData : []);
        setStocks(normalizedStocks);
      } catch {
        setError("Unable to load stocks for this portfolio.");
      } finally {
        setLoading(false);
      }
    };

    if (!portfolioId) {
      setLoading(false);
      setError("Portfolio is required. Open this page from /portfolio.");
      return;
    }

    loadData();
  }, [portfolioId]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!portfolioId) {
      return;
    }

    setTableLoading(true);
    setError("");
    try {
      if (!searchQuery.trim()) {
        const allStocks = await fetchStocks(portfolioId);
        const normalizedStocks = allStocks || [];
        setStocks(normalizedStocks);
      } else {
        const results = await searchStocks(searchQuery.trim(), portfolioId);
        const normalizedStocks = results || [];
        setStocks(normalizedStocks);
      }
    } catch {
      setError("Search request failed.");
    } finally {
      setTableLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          {selectedPortfolio?.name || "Portfolio"} Stocks
        </h1>
        <Link to="/portfolio" className="btn-secondary">
          Back to Portfolio
        </Link>
      </div>

      <div className="card p-5">
        <p className="mb-4 text-sm text-slate-600">
          {selectedPortfolio?.description || "Stocks for selected portfolio."}
        </p>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} />
      </div>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading || tableLoading ? (
        <div className="card p-5">
          <Loader />
        </div>
      ) : stocks.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">No stocks found for this portfolio.</div>
      ) : (
        <div className="space-y-6">
          <StockTable stocks={stocks} />
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900">PE Ratio Comparison</h2>
            <div className="mt-4 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peChartData} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="symbol" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="pe_ratio" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


        </div>
      )}
    </section>
  );
}
