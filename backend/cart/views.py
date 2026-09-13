from django.db import transaction

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from vehicles.models import Vehicle

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


# ============================================================
# GET CUSTOMER CART
# ============================================================

class CartDetailView(generics.RetrieveAPIView):
    """
    Customer can view their own cart.

    The cart is determined from request.user.
    A customer can never access another customer's cart.
    """

    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(
            customer=self.request.user
        )

        return cart


# ============================================================
# ADD VEHICLE TO CART
# ============================================================

class CartItemCreateView(generics.CreateAPIView):
    """
    Customer can add an available vehicle to their cart.
    """

    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        vehicle_id = self.request.data.get(
            "vehicle"
        )

        if not vehicle_id:
            raise ValidationError({
                "vehicle": "Vehicle is required."
            })

        try:
            vehicle = (
                Vehicle.objects
                .select_related(
                    "brand",
                    "category",
                )
                .get(pk=vehicle_id)
            )

        except Vehicle.DoesNotExist:
            raise ValidationError({
                "vehicle": "Vehicle not found."
            })

        # ----------------------------------------------------
        # VEHICLE STATUS
        # ----------------------------------------------------

        if vehicle.status != "available":
            raise ValidationError({
                "vehicle": (
                    "This vehicle is not currently "
                    "available."
                )
            })

        # ----------------------------------------------------
        # GET OR CREATE CUSTOMER CART
        # ----------------------------------------------------

        cart, created = Cart.objects.get_or_create(
            customer=self.request.user
        )

        # ----------------------------------------------------
        # PREVENT DUPLICATE VEHICLE
        # ----------------------------------------------------

        if CartItem.objects.filter(
            cart=cart,
            vehicle=vehicle,
        ).exists():

            raise ValidationError({
                "vehicle": (
                    "This vehicle is already "
                    "in your cart."
                )
            })

        # ----------------------------------------------------
        # CREATE CART ITEM
        # ----------------------------------------------------

        serializer.save(
            cart=cart,
            vehicle=vehicle,
        )


# ============================================================
# REMOVE VEHICLE FROM CART
# ============================================================

class CartItemDeleteView(
    generics.DestroyAPIView
):
    """
    Customer can remove a vehicle from their
    own cart.
    """

    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    lookup_url_kwarg = "vehicle_id"

    def get_queryset(self):

        return (
            CartItem.objects
            .filter(
                cart__customer=self.request.user
            )
            .select_related(
                "cart",
                "vehicle",
                "vehicle__brand",
            )
        )

    def get_object(self):

        return self.get_queryset().get(
            vehicle_id=self.kwargs["vehicle_id"]
        )

# ============================================================
# CLEAR CART
# ============================================================

class CartClearView(generics.DestroyAPIView):
    """
    Remove all vehicles from the customer's cart.
    """

    permission_classes = [IsAuthenticated]

    def get_object(self):

        cart, created = Cart.objects.get_or_create(
            customer=self.request.user
        )

        return cart

    @transaction.atomic
    def perform_destroy(self, instance):

        instance.items.all().delete()