import os
import sys
import numpy as np
import pandas as pd
import joblib
import mlflow
from mlflow.tracking import MlflowClient

# Ensure ml_pipeline is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
if project_root not in sys.path:
    sys.path.append(project_root)

from ml_pipeline.data.ingest import download_data
from ml_pipeline.features.technical_indicators import add_features

from ..apps import TRACKING_URI, MODEL_ALIAS, PredictionConfig

def init_mlflow():
    mlflow.set_tracking_uri(TRACKING_URI)
    return MlflowClient(tracking_uri=TRACKING_URI)

def get_model_metrics():
    """
    Fetches test_mae and test_rmse for the latest version of BTC_LSTM and BTC_GRU
    from the MLflow tracking server.
    """
    client = init_mlflow()
    metrics_data = {}
    
    for model_name, key in [("BTC_LSTM", "lstm"), ("BTC_GRU", "gru")]:
        try:
            # Get latest version for the model (with the production alias or latest)
            model_info = client.get_model_version_by_alias(model_name, MODEL_ALIAS)
            run_id = model_info.run_id
            
            run = client.get_run(run_id)
            metrics = run.data.metrics
            
            metrics_data[key] = {
                "mae": round(metrics.get("test_mae", 0), 2),
                "rmse": round(metrics.get("test_rmse", 0), 2),
                "training_loss": round(metrics.get("loss", 0), 4) # Assuming training loss is logged as 'loss'
            }
        except mlflow.exceptions.RestException as e:
            # Fallback if model or run not found
            metrics_data[key] = {
                "mae": None,
                "rmse": None,
                "training_loss": None,
                "error": "Model or metrics not found"
            }
            
    return metrics_data

def get_model_versions():
    """
    Returns MLflow model registry information (version, stage) for both models.
    """
    client = init_mlflow()
    version_data = {}
    
    for model_name, key in [("BTC_LSTM", "lstm"), ("BTC_GRU", "gru")]:
        try:
            model_info = client.get_model_version_by_alias(model_name, MODEL_ALIAS)
            version_data[key] = {
                "version": int(model_info.version),
                "stage": model_info.current_stage
            }
        except mlflow.exceptions.RestException:
            version_data[key] = {
                "version": "N/A",
                "stage": "Not Registered"
            }
            
    return version_data

def get_model_forecasts():
    """
    Loads both models and runs predictions on the same input sequence.
    Returns the predicted 24-hour forecast for both LSTM and GRU.
    """
    # 1. Fetch Data
    temp_path = os.path.join(project_root, "data", "temp_inference.csv")
    df = download_data(ticker="BTC-USD", period="30d", interval="1h", output_path=temp_path)
    
    df_features = add_features(df)
    
    sequence_length = 72
    if len(df_features) < sequence_length:
        raise ValueError("Not enough data for sequence generation.")
        
    # 2. Load Scaler
    feature_cols = ['Price', 'Volume', 'MA12', 'MA24', 'Volatility', 'Momentum']
    scaler_path = os.path.join(project_root, "data", "scaler.pkl")
    
    if not os.path.exists(scaler_path):
        raise FileNotFoundError("Scaler object not found. Ensure training is completed.")
        
    scaler = joblib.load(scaler_path)
    
    # 3. Load Models
    init_mlflow()
    models = {}
    
    for model_name, key in [("BTC_LSTM", "lstm"), ("BTC_GRU", "gru")]:
        cache_key = f"{model_name}@{MODEL_ALIAS}"
        if cache_key not in PredictionConfig.models:
            try:
                model_uri = f"models:/{model_name}@{MODEL_ALIAS}"
                PredictionConfig.models[cache_key] = mlflow.pyfunc.load_model(model_uri)
            except Exception as e:
                print(f"Failed to load {model_name}: {e}")
                PredictionConfig.models[cache_key] = None
        models[key] = PredictionConfig.models.get(cache_key)

    # 4. Generate forecasts iteratively
    future_hours = 24
    forecasts = {"lstm_forecast": [], "gru_forecast": []}
    
    last_date = pd.to_datetime(df_features['Date'].iloc[-1])
    future_dates = pd.date_range(
        start=last_date + pd.Timedelta(hours=1),
        periods=future_hours,
        freq="h"
    ).astype(str).tolist()

    # Need separate temp_data dataframes because they auto-regress independently based on their own predictions
    temp_data_dict = {
        "lstm": df_features.copy(),
        "gru": df_features.copy()
    }
    
    # Pre-scale the initial sequence
    for _ in range(future_hours):
        for key in ["lstm", "gru"]:
            if models[key] is None:
                continue
                
            temp_data = temp_data_dict[key]
            
            # Scale the last sequence_length hours
            scaled_temp = scaler.transform(temp_data[feature_cols].iloc[-sequence_length:])
            current_sequence = scaled_temp.reshape(1, sequence_length, len(feature_cols))
            
            # Predict ONE scaled value
            pred_scaled = models[key].predict(current_sequence)
            if isinstance(pred_scaled, np.ndarray):
                pred_scaled = pred_scaled[0][0]
            else: 
                pred_scaled = np.array(pred_scaled)[0][0]
                
            # Inverse Scale
            dummy = np.zeros((1, len(feature_cols)))
            dummy[0,0] = pred_scaled
            pred_price = scaler.inverse_transform(dummy)[0,0]
            
            forecasts[f"{key}_forecast"].append(round(float(pred_price), 2))
            
            # Create a new row, copying previous volume to simulate next row
            new_row = temp_data.iloc[-1].copy()
            new_row["Price"] = pred_price
            
            # Append to temp_data
            temp_data = pd.concat([temp_data, pd.DataFrame([new_row])], ignore_index=True)
            
            # Recalculate indicators
            temp_data["MA12"] = temp_data["Price"].rolling(12).mean()
            temp_data["MA24"] = temp_data["Price"].rolling(24).mean()
            temp_data["Volatility"] = temp_data["Price"].rolling(12).std()
            temp_data["Momentum"] = temp_data["Price"] - temp_data["Price"].shift(12)
            
            temp_data = temp_data.bfill()
            temp_data_dict[key] = temp_data
            
    # Format Forecast Response
    formatted_forecasts = {}
    
    # Extract recent history
    history_hours = 72
    recent_history = df_features[['Date', 'Price']].tail(history_hours)
    formatted_forecasts["history"] = [
        {"date": str(row['Date']), "price": round(float(row['Price']), 2)} 
        for _, row in recent_history.iterrows()
    ]
    
    for key in ["lstm", "gru"]:
        if len(forecasts[f"{key}_forecast"]) > 0:
             formatted_forecasts[f"{key}_forecast"] = [{"date": d, "price": p} for d, p in zip(future_dates, forecasts[f"{key}_forecast"])]
        else:
            formatted_forecasts[f"{key}_forecast"] = []

    return formatted_forecasts
