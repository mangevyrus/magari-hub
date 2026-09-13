
from rest_framework import generics
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
)

from .models import Inquiry
from .serializers import (
    InquirySerializer,
    AdminInquirySerializer,
)


# ============================================================
# CUSTOMER
# LIST + CREATE INQUIRIES
# ============================================================

class InquiryListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = InquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Inquiry.objects.filter(
            customer=self.request.user
        ).select_related(
            "vehicle",
            "vehicle__brand",
            "vehicle__category",
        )

    def perform_create(self, serializer):

        serializer.save(
            customer=self.request.user
        )


# ============================================================
# CUSTOMER
# VIEW ONE INQUIRY
# ============================================================

class InquiryDetailView(
    generics.RetrieveAPIView
):

    serializer_class = InquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Inquiry.objects.filter(
            customer=self.request.user
        ).select_related(
            "vehicle",
            "vehicle__brand",
            "vehicle__category",
        )


# ============================================================
# ADMIN
# LIST ALL INQUIRIES
# ============================================================

class AdminInquiryListView(
    generics.ListAPIView
):

    serializer_class = AdminInquirySerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get_queryset(self):

        return Inquiry.objects.all().select_related(
            "customer",
            "vehicle",
            "vehicle__brand",
            "vehicle__category",
        )


# ============================================================
# ADMIN
# VIEW + UPDATE ONE INQUIRY
# ============================================================

class AdminInquiryDetailView(
    generics.RetrieveUpdateAPIView
):

    serializer_class = AdminInquirySerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get_queryset(self):

        return Inquiry.objects.all().select_related(
            "customer",
            "vehicle",
            "vehicle__brand",
            "vehicle__category",
        )

