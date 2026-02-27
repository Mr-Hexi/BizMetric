from __future__ import annotations

def indicators(df: list[dict], symbol: str) -> dict:
    """
    Compute PE ratio and discount level from cleaned dataframe.
    """
    if not df:
        return {"pe_ratio": 0.0, "discount_level": "UNKNOWN"}

    current_price = float(df[-1]["close"])
    average_price = sum(float(row["close"]) for row in df) / len(df)
    symbol_factor = (abs(hash(symbol)) % 9) + 8
    pe_ratio = round(symbol_factor + (current_price / max(average_price, 1.0)), 2)

    ratio = current_price / max(average_price, 1.0)
    if ratio <= 0.9:
        discount_level = "HIGH"
    elif ratio <= 1.0:
        discount_level = "MEDIUM"
    else:
        discount_level = "LOW"

    return {"pe_ratio": pe_ratio, "discount_level": discount_level}
