from django.urls import path
from .views import (
    PredictAPIView, 
    ModelMetricsAPIView, 
    ModelInfoAPIView, 
    ModelForecastsAPIView
)

urlpatterns = [
    path('predict/', PredictAPIView.as_view(), kwargs={'model_type': 'lstm'}, name='predict_default'),
    path('predict/lstm/', PredictAPIView.as_view(), kwargs={'model_type': 'lstm'}, name='predict_lstm'),
    path('predict/gru/', PredictAPIView.as_view(), kwargs={'model_type': 'gru'}, name='predict_gru'),
    
    # Dashboard Endpoints
    path('models/metrics/', ModelMetricsAPIView.as_view(), name='model_metrics'),
    path('models/info/', ModelInfoAPIView.as_view(), name='model_info'),
    path('models/forecast/', ModelForecastsAPIView.as_view(), name='model_forecasts'),
]
