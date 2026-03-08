import React, { useState, useEffect } from 'react';
import { getMetrics, getModelInfo, getForecast } from '../services/api';

import PredictionCard from '../components/PredictionCard';
import ModelInfo from '../components/ModelInfo';
import ModelMetrics from '../components/ModelMetrics';
import ForecastChart from '../components/ForecastChart';
import ForecastComparison from '../components/ForecastComparison';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [info, setInfo] = useState(null);
    const [forecasts, setForecasts] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [metricsRes, infoRes, forecastRes] = await Promise.all([
                getMetrics(),
                getModelInfo(),
                getForecast()
            ]);

            setMetrics(metricsRes);
            setInfo(infoRes);
            setForecasts(forecastRes);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const lstmData = forecasts?.lstm_forecast || [];
    const gruData = forecasts?.gru_forecast || [];
    const historyData = forecasts?.history || [];

    const currentPrice = historyData.length > 0 ? historyData[historyData.length - 1].price : null;
    const lstmNextPrice = lstmData.length > 0 ? lstmData[0].price : null;
    const gruNextPrice = gruData.length > 0 ? gruData[0].price : null;

    return (
        <div className="container">
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">BTC Forecast Dashboard</h1>
                    <p className="dashboard-subtitle">Real-time MLflow metrics, registry stages, and predictions</p>
                </div>
                <button
                    onClick={loadData}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading && (
                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </header>

            {/* Top Row: Info, Metrics, Predictions */}
            <div className="grid-top">

                {/* Model Info */}
                <div className="model-info-container">
                    <ModelInfo info={info} loading={loading} />
                </div>

                {/* Prediction Cards */}
                <div className="grid-predictions">
                    <PredictionCard
                        title="Current BTC Price"
                        price={currentPrice}
                        modelType="current"
                        loading={loading}
                    />
                    <PredictionCard
                        title="LSTM Next Price"
                        price={lstmNextPrice}
                        modelType="lstm"
                        loading={loading}
                    />
                    <PredictionCard
                        title="GRU Next Price"
                        price={gruNextPrice}
                        modelType="gru"
                        loading={loading}
                    />
                </div>

                {/* Metrics Table */}
                <div className="metrics-container">
                    <ModelMetrics metrics={metrics} loading={loading} />
                </div>
            </div>

            {/* Middle Row: Comparison Chart */}
            <div className="mb-6">
                <ForecastComparison historyData={historyData} lstmData={lstmData} gruData={gruData} loading={loading} />
            </div>

            {/* Bottom Row: Individual Charts */}
            <div className="grid-bottom">
                <ForecastChart
                    historyData={historyData}
                    forecastData={lstmData}
                    modelType="lstm"
                    title="LSTM Single-Model Forecast"
                    loading={loading}
                />
                <ForecastChart
                    historyData={historyData}
                    forecastData={gruData}
                    modelType="gru"
                    title="GRU Single-Model Forecast"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Dashboard;
