from django.urls import path
from .views import PaymentHistoryView, ProcessPaymentView

urlpatterns = [
    path('history/', PaymentHistoryView.as_view(), name='payment_history'),
    path('process/', ProcessPaymentView.as_view(), name='process_payment'),
]
