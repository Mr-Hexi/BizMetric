import api from "./axios";

export const fetchPortfolio = async () => {
  const { data } = await api.get("portfolio/");
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

export const searchStocks = async (query, portfolioId = null) => {
  const queryParams = new URLSearchParams({ q: query });
  if (portfolioId) {
    queryParams.set("portfolio", String(portfolioId));
  }
  const { data } = await api.get(`stocks/search/?${queryParams.toString()}`);
  return data;
};

export const fetchStockById = async (id) => {
  const { data } = await api.get(`stocks/${id}/`);
  return data;
};
