from django.urls import path
from .views import ProductListView, ProductDetailView, AdminProductView, AdminProductDetailView

urlpatterns = [
    path('', ProductListView.as_view(), name='product_list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('admin/', AdminProductView.as_view(), name='admin_product'),
    path('admin/<int:pk>/', AdminProductDetailView.as_view(), name='admin_product_detail'),
]
