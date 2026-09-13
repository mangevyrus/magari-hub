from django.urls import path

from .views import (
    CartDetailView,
    CartItemCreateView,
    CartItemDeleteView,
    CartClearView,
)


urlpatterns = [

    # ========================================================
    # CUSTOMER CART
    # ========================================================

    path(
        "",
        CartDetailView.as_view(),
        name="cart-detail",
    ),

    # ========================================================
    # ADD VEHICLE
    # ========================================================

    path(
        "items/",
        CartItemCreateView.as_view(),
        name="cart-item-create",
    ),

    # ========================================================
    # REMOVE VEHICLE
    # ========================================================

    path(
        "items/<int:vehicle_id>/",
        CartItemDeleteView.as_view(),
        name="cart-item-delete",
    ),

    # ========================================================
    # CLEAR CART
    # ========================================================

    path(
        "clear/",
        CartClearView.as_view(),
        name="cart-clear",
    ),
]