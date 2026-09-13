
from django.urls import path

from .views import (
    RegisterView,
    MeView,
    ProfileView,
    AccountView,
    AdminTokenView,

    AdminCustomerListView,
    AdminCustomerDetailView,
    AdminCustomerStatusView,
    AdminCustomerDeleteView,
)


urlpatterns = [

    # ========================================================
    # CUSTOMER AUTHENTICATION
    # ========================================================

    path(
        "register/",
        RegisterView.as_view(),
        name="customer-register"
    ),

    path(
        "me/",
        MeView.as_view(),
        name="customer-me"
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="customer-profile"
    ),

    path(
        "account/",
        AccountView.as_view(),
        name="customer-account"
    ),

    # ========================================================
    # ADMIN AUTHENTICATION
    # ========================================================

    path(
        "admin-token/",
        AdminTokenView.as_view(),
        name="admin-token"
    ),

    # ========================================================
    # ADMIN CUSTOMER MANAGEMENT
    # ========================================================

    path(
        "admin/customers/",
        AdminCustomerListView.as_view(),
        name="admin-customers"
    ),

    path(
        "admin/customers/<int:user_id>/",
        AdminCustomerDetailView.as_view(),
        name="admin-customer-detail"
    ),

    path(
        "admin/customers/<int:user_id>/status/",
        AdminCustomerStatusView.as_view(),
        name="admin-customer-status"
    ),

    path(
        "admin/customers/<int:user_id>/delete/",
        AdminCustomerDeleteView.as_view(),
        name="admin-customer-delete"
    ),
]

