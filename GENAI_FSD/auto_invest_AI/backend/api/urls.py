from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import AuthViewSet, PortfolioViewSet, StockViewSet

router = DefaultRouter()
router.register("portfolio", PortfolioViewSet, basename="portfolio")
router.register("stocks", StockViewSet, basename="stocks")

urlpatterns = [
    path(
        "register/",
        AuthViewSet.as_view({"post": "register"}),
        name="register",
    ),
    path(
        "login/",
        AuthViewSet.as_view({"post": "login"}),
        name="login",
    ),
    path("", include(router.urls)),
]
