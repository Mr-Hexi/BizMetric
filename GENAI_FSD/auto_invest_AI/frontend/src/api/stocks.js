import api from "./axios";

export const fetchPortfolio = async () => {
  const { data } = await api.get("portfolio/");
  return data;
};

export const createPortfolio = async (payload) => {
  const { data } = await api.post("portfolio/", payload);
  return data;
};

export const addStockToPortfolio = async (portfolioId, symbol) => {
  const { data } = await api.post(`portfolio/${portfolioId}/add-stock/`, { symbol });
  return data;
};

export const fetchStocks = async (portfolioId = null) => {
  const queryParams = new URLSearchParams();
  if (portfolioId) {
    queryParams.set("portfolio", String(portfolioId));
  }
  const suffix = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const { data } = await api.get(`stocks/${suffix}`);
  return data;
};

export const searchLiveStocks = async (query, limit = 10) => {
  const queryParams = new URLSearchParams({
    q: query,
    limit: String(limit),
  });
  const { data } = await api.get(`stocks/live-search/?${queryParams.toString()}`);
  return data;
};

export const fetchLiveStockBySymbol = async (symbol) => {
  const queryParams = new URLSearchParams({ symbol });
  const { data } = await api.get(`stocks/live-detail/?${queryParams.toString()}`);
  return data;
};

export const fetchStockById = async (id) => {
  const { data } = await api.get(`stocks/${id}/`);
  return data;
};
