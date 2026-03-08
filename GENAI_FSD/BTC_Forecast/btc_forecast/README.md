# BTC-USD Forecasting System

An end-to-end MLOps pipeline for forecasting BTC-USD prices using LSTM, MLflow, and a Django REST API.

## Setup Instructions

1. Activate your environment:
   `conda activate ml`
2. Install dependencies:
   `pip install -r requirements.txt`

## Running MLflow
Start the MLflow tracking server locally:
```bash
mlflow server --host 127.0.0.1 --port 5000
```

## Running the ML Pipeline
Train and track the model:
```bash
python ml_pipeline/models/train_lstm.py
```

## Running the Django Backend
Navigate to the `backend` directory, apply migrations, and run the server:
```bash
cd backend
python manage.py migrate
python manage.py runserver
```
