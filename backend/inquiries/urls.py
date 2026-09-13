
from django.urls import path

from .views import (
    InquiryListCreateView,
    InquiryDetailView,
    AdminInquiryListView,
    AdminInquiryDetailView,
)


urlpatterns = [

    # ============================================================
    # CUSTOMER
    # ============================================================

    path(
        "",
        InquiryListCreateView.as_view(),
        name="inquiry-list-create",
    ),

    path(
        "<int:pk>/",
        InquiryDetailView.as_view(),
        name="inquiry-detail",
    ),


    # ============================================================
    # ADMIN
    # ============================================================

    path(
        "admin/",
        AdminInquiryListView.as_view(),
        name="admin-inquiry-list",
    ),

    path(
        "admin/<int:pk>/",
        AdminInquiryDetailView.as_view(),
        name="admin-inquiry-detail",
    ),
]
