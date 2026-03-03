import { useLocation, useNavigate } from "react-router-dom";
import OpportunityBadge from "./OpportunityBadge";
import { currencyCodeFromItem, formatMoney } from "../utils/currency";

export default function StockTable({ stocks, onDeleteStock, deletingStockId }) {
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
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Action</th>
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
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {formatMoney(stock.current_price, currencyCodeFromItem(stock))}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {formatMoney(stock.min_price, currencyCodeFromItem(stock))}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {formatMoney(stock.max_price, currencyCodeFromItem(stock))}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {formatMoney(stock.closing_price, currencyCodeFromItem(stock))}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">{stock.pe_ratio ?? "-"}</td>
                <td className="px-4 py-3 text-center">
                  <OpportunityBadge level={stock.discount_level} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                    disabled={!stock.id || deletingStockId === stock.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (stock.id && onDeleteStock) {
                        onDeleteStock(stock.id, stock.symbol);
                      }
                    }}
                  >
                    {deletingStockId === stock.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

