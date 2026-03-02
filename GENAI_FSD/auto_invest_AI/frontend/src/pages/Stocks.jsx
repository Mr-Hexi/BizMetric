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
import {
  addStockToPortfolio,
  fetchPortfolio,
  fetchStocks,
  searchLiveStocks,
} from "../api/stocks";

export default function Stocks() {
  const [searchParams] = useSearchParams();
  const portfolioId = searchParams.get("portfolio");

  const [portfolios, setPortfolios] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingSymbol, setAddingSymbol] = useState("");
  const [message, setMessage] = useState("");
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
  const portfolioSymbols = useMemo(
    () => new Set(stocks.map((stock) => String(stock.symbol).toUpperCase())),
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
    setMessage("");
    try {
      if (!searchQuery.trim()) {
        setSearchResults([]);
      } else {
        const results = await searchLiveStocks(searchQuery.trim(), 20);
        setSearchResults(results || []);
      }
    } catch {
      setError("Search request failed.");
    } finally {
      setTableLoading(false);
    }
  };

  const handleAddStock = async (symbol) => {
    if (!portfolioId || !symbol) {
      return;
    }

    setAddingSymbol(symbol);
    setMessage("");
    setError("");
    try {
      await addStockToPortfolio(portfolioId, String(symbol).trim().toUpperCase());
      const refreshed = await fetchStocks(portfolioId);
      setStocks(refreshed || []);
      setMessage(`${symbol} added to portfolio.`);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Unable to add stock. Check symbol and try again.";
      setError(message);
    } finally {
      setAddingSymbol("");
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
        <p className="mt-2 text-xs text-slate-500">
          Search live symbols and add any result directly to this portfolio.
        </p>
      </div>

      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading || tableLoading ? (
        <div className="card p-5">
          <Loader />
        </div>
      ) : (
        <div className="space-y-6">
          {searchResults.length > 0 && (
            <div className="card p-5">
              <h2 className="text-lg font-semibold text-slate-900">Search Results</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Company</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {searchResults.map((result) => {
                      const symbol = String(result.symbol || "").toUpperCase();
                      const alreadyAdded = portfolioSymbols.has(symbol);
                      return (
                        <tr key={symbol}>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{result.symbol}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{result.company_name}</td>
                          <td className="px-4 py-3 text-right text-sm text-slate-700">
                            Rs {Number(result.current_price || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleAddStock(result.symbol)}
                              className="btn-primary"
                              disabled={alreadyAdded || addingSymbol === result.symbol}
                            >
                              {alreadyAdded
                                ? "Added"
                                : addingSymbol === result.symbol
                                  ? "Adding..."
                                  : "Add Stock"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {stocks.length === 0 ? (
            <div className="card p-8 text-center text-sm text-slate-500">
              No stocks in this portfolio yet. Use search above and add stocks.
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
