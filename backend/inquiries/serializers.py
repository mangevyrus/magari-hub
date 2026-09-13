
from rest_framework import serializers

from .models import Inquiry


# ============================================================
# CUSTOMER SERIALIZER
# ============================================================

class InquirySerializer(serializers.ModelSerializer):

    customer_username = serializers.CharField(
        source="customer.username",
        read_only=True,
    )

    vehicle_name = serializers.SerializerMethodField(
        read_only=True,
    )

    class Meta:
        model = Inquiry

        fields = [
            "id",
            "customer",
            "customer_username",
            "vehicle",
            "vehicle_name",
            "subject",
            "message",
            "admin_response",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "customer_username",
            "vehicle_name",
            "admin_response",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_vehicle_name(self, obj):
        return str(obj.vehicle)


# ============================================================
# ADMIN SERIALIZER
# ============================================================

class AdminInquirySerializer(serializers.ModelSerializer):

    customer_username = serializers.CharField(
        source="customer.username",
        read_only=True,
    )

    customer_email = serializers.EmailField(
        source="customer.email",
        read_only=True,
    )

    vehicle_name = serializers.SerializerMethodField(
        read_only=True,
    )

    class Meta:
        model = Inquiry

        fields = [
            "id",
            "customer",
            "customer_username",
            "customer_email",
            "vehicle",
            "vehicle_name",
            "subject",
            "message",
            "admin_response",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "customer_username",
            "customer_email",
            "vehicle",
            "vehicle_name",
            "subject",
            "message",
            "created_at",
            "updated_at",
        ]

    def get_vehicle_name(self, obj):
        return str(obj.vehicle)

