from django.urls import path
from .views import CategoryListView, AdminCategoryView, AdminCategoryDetailView

urlpatterns = [
    path('', CategoryListView.as_view(), name='category_list'),
    path('admin/', AdminCategoryView.as_view(), name='admin_category'),
    path('admin/<int:pk>/', AdminCategoryDetailView.as_view(), name='admin_category_detail'),
]
