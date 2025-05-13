from django.urls import path
from checkout_kata.views import ProductView, OfferView, CartView


urlpatterns = [
    # Product API
    path("products/", ProductView.as_view(), name="product-list"),
    path("products/", ProductView.as_view(), name="product-create"),
    path("products/<int:pk>/", ProductView.as_view(), name="product-delete"),

    # Cart API
    path("cart/", CartView.as_view(), name="cart"),

    # Offer API
    path("offers/<int:pk>/", OfferView.as_view(), name="discount-detail"),
    path("offers/", OfferView.as_view(), name="discount-create-update-delete"),
]