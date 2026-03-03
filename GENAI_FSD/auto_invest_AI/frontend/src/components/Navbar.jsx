import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ACTIVE_PORTFOLIO_KEY = "active_portfolio_id";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activePortfolioId = sessionStorage.getItem(ACTIVE_PORTFOLIO_KEY);
  const stocksPath = activePortfolioId
    ? `/stocks?portfolio=${activePortfolioId}`
    : "/portfolio?notice=select-portfolio";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      location.pathname.startsWith(path)
        ? "bg-brand-50 text-brand-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/portfolio" className="text-lg font-bold text-brand-900">
          AUTO INVEST
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/portfolio" className={linkClass("/portfolio")}>
                Portfolio
              </Link>
              <Link
                to={stocksPath}
                className={`${linkClass("/stocks")} ${activePortfolioId ? "" : "opacity-70"}`}
                title={activePortfolioId ? "Open active portfolio stocks" : "Select a portfolio first"}
              >
                Stocks
              </Link>
              <Link to="/compare" className={linkClass("/compare")}>
                Compare Stocks
              </Link>
              <span className="hidden text-sm text-slate-600 sm:inline">{user?.username}</span>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
