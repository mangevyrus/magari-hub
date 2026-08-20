from django.urls import path

from .views import (
    RegisterView,
    MeView,
    ProfileView,
    AccountView,
    AdminTokenView,
)


urlpatterns = [

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

    path(
        "admin-token/",
        AdminTokenView.as_view(),
        name="admin-token"
    ),
]