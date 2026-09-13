
from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "order_number",
        "customer",
        "vehicle",
        "price",
        "status",
        "fulfillment_method",
        "created_at",
    )

    list_filter = (
        "status",
        "fulfillment_method",
        "created_at",
    )

    search_fields = (
        "order_number",
        "customer__username",
        "customer__email",
        "full_name",
        "phone",
        "vehicle__model",
    )

    readonly_fields = (
        "order_number",
        "price",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )
