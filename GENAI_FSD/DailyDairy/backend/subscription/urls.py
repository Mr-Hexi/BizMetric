from django.urls import path
from .views import SubscriptionListView, SubscriptionDetailView, AdminSubscriptionView

urlpatterns = [
    path('', SubscriptionListView.as_view(), name='subscription_list'),
    path('<int:pk>/', SubscriptionDetailView.as_view(), name='subscription_detail'),
    path('admin/', AdminSubscriptionView.as_view(), name='admin_subscription'),
]
