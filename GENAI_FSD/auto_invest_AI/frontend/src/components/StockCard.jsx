import OpportunityBadge from "./OpportunityBadge";

export default function StockCard({ stock }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{stock.symbol}</h3>
      <p className="mt-1 text-lg font-semibold text-slate-900">{stock.company_name}</p>
      <p className="mt-3 text-sm text-slate-600">Current Price</p>
      <p className="text-xl font-bold text-brand-900">Rs {Number(stock.current_price || 0).toFixed(2)}</p>
      <div className="mt-4">
        <OpportunityBadge level={stock.discount_level} />
      </div>
    </div>
  );
}
