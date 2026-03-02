import { useLocation, useNavigate } from "react-router-dom";
import OpportunityBadge from "./OpportunityBadge";

export default function StockTable({ stocks }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Company Name</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Current Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Min Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Max Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Today Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">PE Ratio</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">Discount Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {stocks.map((stock) => (
              <tr
                key={stock.id ?? stock.symbol}
                className={`${stock.id || stock.is_live ? "cursor-pointer hover:bg-brand-50" : "cursor-default"} transition`}
                onClick={() => {
                  if (stock.id) {
                    navigate(`/stocks/${stock.id}`, {
                      state: { from: `${location.pathname}${location.search}` },
                    });
                  } else if (stock.is_live && stock.symbol) {
                    navigate(`/stocks/live/${encodeURIComponent(stock.symbol)}`, {
                      state: { from: `${location.pathname}${location.search}` },
                    });
                  }
                }}
              >
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{stock.symbol}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{stock.company_name}</td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">Rs {Number(stock.current_price || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {stock.min_price == null ? "-" : `Rs ${Number(stock.min_price).toFixed(2)}`}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {stock.max_price == null ? "-" : `Rs ${Number(stock.max_price).toFixed(2)}`}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {stock.closing_price == null ? "-" : `Rs ${Number(stock.closing_price).toFixed(2)}`}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">{stock.pe_ratio ?? "-"}</td>
                <td className="px-4 py-3 text-center">
                  <OpportunityBadge level={stock.discount_level} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
