from django.contrib import admin

from .models import Cart, CartItem


# ============================================================
# CART ITEM INLINE
# ============================================================

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

    fields = [
        "vehicle",
        "added_at",
    ]

    readonly_fields = [
        "added_at",
    ]

    autocomplete_fields = [
        "vehicle",
    ]


# ============================================================
# CART ADMIN
# ============================================================

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "customer",
        "item_count",
        "created_at",
        "updated_at",
    ]

    search_fields = [
        "customer__username",
        "customer__email",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]

    autocomplete_fields = [
        "customer",
    ]

    inlines = [
        CartItemInline,
    ]

    ordering = [
        "-updated_at",
    ]

    def item_count(self, obj):
        return obj.items.count()

    item_count.short_description = "Items"


# ============================================================
# CART ITEM ADMIN
# ============================================================

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "cart",
        "customer",
        "vehicle",
        "vehicle_price",
        "added_at",
    ]

    search_fields = [
        "cart__customer__username",
        "cart__customer__email",
        "vehicle__model",
        "vehicle__brand__name",
    ]

    readonly_fields = [
        "added_at",
    ]

    autocomplete_fields = [
        "cart",
        "vehicle",
    ]

    list_select_related = [
        "cart",
        "cart__customer",
        "vehicle",
        "vehicle__brand",
    ]

    ordering = [
        "-added_at",
    ]

    def customer(self, obj):
        return obj.cart.customer

    customer.short_description = "Customer"

    def vehicle_price(self, obj):
        return obj.vehicle.price

    vehicle_price.short_description = "Vehicle Price"