import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchPortfolio } from "../api/stocks";

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPortfolios = async () => {
      setLoading(true);
      setError("");
      try {
        const portfolioData = await fetchPortfolio();
        setPortfolios(Array.isArray(portfolioData) ? portfolioData : []);
      } catch {
        setError("Unable to load portfolios.");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolios();
  }, []);

  return (
    <section className="space-y-6">
      <div className="card p-5">
        <h1 className="text-2xl font-bold text-slate-900">Portfolios</h1>
        <p className="mt-1 text-sm text-slate-600">Select a portfolio to open stocks page.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {portfolios.map((portfolio) => (
            <button
              key={portfolio.id}
              type="button"
              onClick={() => navigate(`/stocks?portfolio=${portfolio.id}`)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-brand-300 hover:bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-900">{portfolio.name}</p>
              <p className="mt-1 text-xs text-slate-600">{portfolio.description}</p>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="card p-5">
          <Loader />
        </div>
      ) : portfolios.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">No portfolios found.</div>
      ) : (
        <div className="card p-8 text-center text-sm text-slate-500">
          Choose a portfolio card above to view its stocks.
        </div>
      )}
    </section>
  );
}
