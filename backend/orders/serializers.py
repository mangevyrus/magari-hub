
from rest_framework import serializers

from .models import Order


# ============================================================
# CUSTOMER ORDER SERIALIZER
# ============================================================

class OrderSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.SerializerMethodField(
        read_only=True
    )

    vehicle_price = serializers.SerializerMethodField(
        read_only=True
    )

    customer_username = serializers.CharField(
        source="customer.username",
        read_only=True,
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "customer",
            "customer_username",
            "vehicle",
            "vehicle_name",
            "vehicle_price",
            "price",
            "status",
            "full_name",
            "phone",
            "email",
            "location",
            "fulfillment_method",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "order_number",
            "customer",
            "customer_username",
            "vehicle_name",
            "vehicle_price",
            "price",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_vehicle_name(self, obj):
        return str(obj.vehicle)

    def get_vehicle_price(self, obj):
        return obj.vehicle.price


# ============================================================
# ADMIN ORDER SERIALIZER
# ============================================================

class AdminOrderSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(
        source="customer.username",
        read_only=True,
    )

    customer_email = serializers.EmailField(
        source="customer.email",
        read_only=True,
    )

    vehicle_name = serializers.SerializerMethodField(
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "customer",
            "customer_username",
            "customer_email",
            "vehicle",
            "vehicle_name",
            "price",
            "status",
            "full_name",
            "phone",
            "email",
            "location",
            "fulfillment_method",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "order_number",
            "customer",
            "customer_username",
            "customer_email",
            "vehicle",
            "vehicle_name",
            "price",
            "full_name",
            "phone",
            "email",
            "location",
            "fulfillment_method",
            "notes",
            "created_at",
            "updated_at",
        ]

    def get_vehicle_name(self, obj):
        return str(obj.vehicle)
