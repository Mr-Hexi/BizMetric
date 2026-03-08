import yfinance as yf
import pandas as pd
import os

def download_data(ticker="BTC-USD", period="730d", interval="1h", output_path="data/btc_raw.csv"):
    """
    Downloads historical hourly data for a given ticker from Yahoo Finance.
    Saves to the specified path.
    """
    print(f"Downloading {ticker} data for {period} at {interval} interval...")
    df = yf.download(ticker, period=period, interval=interval)
    
    # yfinance sometimes returns a multi-index column, flatten it
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.droplevel(1)
        
    df.reset_index(inplace=True)
    
    # Filter only required columns
    df = df[['Datetime', 'Close', 'Volume']].copy()
    
    # Rename Close to Price to match the new architecture
    df.rename(columns={"Close": "Price", "Datetime": "Date"}, inplace=True)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Data saved to {output_path}")
    
    return df

if __name__ == "__main__":
    download_data(output_path="../../data/btc_raw.csv")
