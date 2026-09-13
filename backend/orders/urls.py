
from django.urls import path

from .views import (
    OrderListCreateView,
    OrderDetailView,
    AdminOrderListView,
    AdminOrderDetailView,
    CheckoutView,
)


urlpatterns = [

    # ========================================================
    # CUSTOMER
    # ========================================================

    path(
        "",
        OrderListCreateView.as_view(),
        name="order-list-create",
    ),

    path(
        "<int:pk>/",
        OrderDetailView.as_view(),
        name="order-detail",
    ),
    
path( "checkout/", CheckoutView.as_view(), name="checkout", ),

    # ========================================================
    # ADMIN
    # ========================================================

    path(
        "admin/",
        AdminOrderListView.as_view(),
        name="admin-order-list",
    ),

    path(
        "admin/<int:pk>/",
        AdminOrderDetailView.as_view(),
        name="admin-order-detail",
    ),
]