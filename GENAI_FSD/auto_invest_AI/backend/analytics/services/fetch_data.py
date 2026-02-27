from __future__ import annotations

from datetime import date, timedelta
import random

def fetch_data(symbol: str, days: int = 365) -> list[dict]:
    """
    Return mock historical price data for a stock symbol.
    """
    seed = abs(hash(symbol)) % (10**6)
    rng = random.Random(seed)

    start = date.today() - timedelta(days=days - 1)
    rows = []
    base_price = rng.uniform(200, 1500)
    for idx in range(days):
        trade_date = start + timedelta(days=idx)
        noise = rng.uniform(-25, 25)
        close = max(1.0, base_price + (idx * rng.uniform(-1.5, 2.5)) + noise)
        rows.append({"date": trade_date.isoformat(), "close": round(close, 2)})

    return rows
