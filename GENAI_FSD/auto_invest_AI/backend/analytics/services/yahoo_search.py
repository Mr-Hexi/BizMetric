from __future__ import annotations

from typing import Any
from datetime import datetime, timezone

import yfinance as yf

from analytics.services.opportunity_engine import opportunity_engine


def _discount_level(min_price: float, max_price: float, current_price: float) -> str:
    if max_price <= min_price:
        return "MEDIUM"
    price_position = (current_price - min_price) / (max_price - min_price)
    if price_position <= 0.33:
        return "HIGH"
    if price_position <= 0.66:
        return "MEDIUM"
    return "LOW"


def search_live_stocks(query: str, limit: int = 10) -> list[dict[str, Any]]:
    """
    Search worldwide stocks from Yahoo Finance and return normalized rows
    compatible with stock list table fields.
    """
    if not query.strip():
        return []

    candidates: list[dict[str, str]] = []
    try:
        search = yf.Search(query, max_results=limit)
        quotes = getattr(search, "quotes", []) or []
        for quote in quotes:
            symbol = quote.get("symbol")
            if not symbol:
                continue
            quote_type = quote.get("quoteType")
            if quote_type and str(quote_type).upper() != "EQUITY":
                continue
            company_name = (
                quote.get("shortname")
                or quote.get("longname")
                or quote.get("displayName")
                or symbol
            )
            candidates.append({"symbol": symbol, "company_name": company_name})
            if len(candidates) >= limit:
                break
    except Exception:
        candidates = []

    if not candidates:
        candidates = [{"symbol": query.upper(), "company_name": query.upper()}]

    results: list[dict[str, Any]] = []
    for candidate in candidates[:limit]:
        symbol = candidate["symbol"]
        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period="1y", interval="1d")
            if history.empty:
                continue

            closes = history["Close"].dropna()
            if closes.empty:
                continue

            min_price = round(float(closes.min()), 2)
            max_price = round(float(closes.max()), 2)
            closing_price = round(float(closes.iloc[-1]), 2)

            pe_ratio = None
            company_name = candidate["company_name"]
            try:
                info = ticker.info or {}
                pe_ratio = info.get("trailingPE") or info.get("forwardPE")
                company_name = info.get("shortName") or info.get("longName") or company_name
            except Exception:
                pass

            pe_ratio_value = round(float(pe_ratio), 2) if pe_ratio is not None else None
            results.append(
                {
                    "id": None,
                    "symbol": symbol,
                    "company_name": company_name,
                    "current_price": closing_price,
                    "min_price": min_price,
                    "max_price": max_price,
                    "closing_price": closing_price,
                    "pe_ratio": pe_ratio_value,
                    "discount_level": _discount_level(
                        min_price=min_price,
                        max_price=max_price,
                        current_price=closing_price,
                    ),
                    "is_live": True,
                }
            )
        except Exception:
            continue

    return results


def fetch_live_stock_detail(symbol: str) -> dict[str, Any] | None:
    """
    Fetch one live stock detail from Yahoo Finance and return payload
    compatible with local StockDetail response shape.
    """
    ticker_symbol = symbol.strip().upper()
    if not ticker_symbol:
        return None

    try:
        ticker = yf.Ticker(ticker_symbol)
        history = ticker.history(period="1y", interval="1d")
        if history.empty:
            return None

        closes = history["Close"].dropna()
        if closes.empty:
            return None

        dates = [idx.strftime("%Y-%m-%d") for idx in closes.index]
        prices = [round(float(value), 2) for value in closes.tolist()]
        moving_avg = [
            round(float(closes.iloc[max(0, i - 4): i + 1].mean()), 2)
            for i in range(len(closes))
        ]

        current_price = prices[-1]
        min_price = min(prices)
        max_price = max(prices)
        discount_level = _discount_level(min_price=min_price, max_price=max_price, current_price=current_price)

        pe_ratio = None
        company_name = ticker_symbol
        sector = "Global"
        try:
            info = ticker.info or {}
            pe_ratio = info.get("trailingPE") or info.get("forwardPE")
            company_name = info.get("shortName") or info.get("longName") or ticker_symbol
            sector = info.get("sector") or "Global"
        except Exception:
            pass

        pe_value = round(float(pe_ratio), 2) if pe_ratio is not None else 0.0
        opportunity_score = opportunity_engine(pe_ratio=pe_value, discount_level=discount_level)

        return {
            "id": None,
            "portfolio": None,
            "portfolio_name": "Global Search",
            "symbol": ticker_symbol,
            "company_name": company_name,
            "sector": sector,
            "current_price": current_price,
            "min_price": round(min_price, 2),
            "max_price": round(max_price, 2),
            "today_price": round(current_price, 2),
            "is_live": True,
            "analytics": {
                "pe_ratio": pe_value if pe_ratio is not None else None,
                "discount_level": discount_level,
                "opportunity_score": opportunity_score,
                "graph_data": {
                    "dates": dates,
                    "price": prices,
                    "moving_avg": moving_avg,
                },
                "last_updated": datetime.now(timezone.utc).isoformat(),
            },
        }
    except Exception:
        return None
