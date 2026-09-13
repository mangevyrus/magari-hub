
from django.db import transaction

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from vehicles.models import Vehicle
from cart.models import Cart
from rest_framework.response import Response
from .models import Order
from .serializers import (
    OrderSerializer,
    AdminOrderSerializer,
)


# ============================================================
# CUSTOMER ORDERS
# ============================================================

class OrderListCreateView(generics.ListCreateAPIView):
    """
    Customer can:
    - View their own orders
    - Create a single order manually
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(customer=self.request.user)
            .select_related("vehicle", "customer")
        )

    def perform_create(self, serializer):

        vehicle_id = self.request.data.get("vehicle")

        if not vehicle_id:
            raise ValidationError({
                "vehicle": "Vehicle is required."
            })

        try:
            vehicle = Vehicle.objects.get(
                pk=vehicle_id
            )
        except Vehicle.DoesNotExist:
            raise ValidationError({
                "vehicle": "Vehicle not found."
            })

        # --------------------------------------------------------
        # CHECK VEHICLE STATUS
        # --------------------------------------------------------

        if vehicle.status != "available":
            raise ValidationError({
                "vehicle": (
                    "This vehicle is not currently "
                    "available for purchase."
                )
            })

        # --------------------------------------------------------
        # CHECK EXISTING ACTIVE ORDER
        # --------------------------------------------------------

        existing_order = Order.objects.filter(
            vehicle=vehicle,
            status__in=[
                "pending",
                "confirmed",
                "processing",
            ],
        ).exists()

        if existing_order:
            raise ValidationError({
                "vehicle": (
                    "This vehicle already has an "
                    "active order."
                )
            })

        # --------------------------------------------------------
        # CREATE ORDER
        # --------------------------------------------------------

        serializer.save(
            customer=self.request.user,
            price=vehicle.price,
        )


# ============================================================
# CUSTOMER ORDER DETAIL
# ============================================================

class OrderDetailView(generics.RetrieveAPIView):
    """
    Customer can view one of their own orders.
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(customer=self.request.user)
            .select_related("vehicle", "customer")
        )


# ============================================================
# CHECKOUT
# ============================================================

class CheckoutView(generics.CreateAPIView):
    """
    Checkout the customer's entire cart.

    Process:

    1. Get customer's cart
    2. Lock vehicles
    3. Verify every vehicle is available
    4. Create one order for each vehicle
    5. Reserve every vehicle
    6. Clear the cart

    Everything happens inside one database transaction.
    """

    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):

        user = request.user

        # --------------------------------------------------------
        # CUSTOMER INFORMATION
        # --------------------------------------------------------

        full_name = request.data.get(
            "full_name",
            ""
        ).strip()

        phone = request.data.get(
            "phone",
            ""
        ).strip()

        email = request.data.get(
            "email",
            ""
        ).strip()

        location = request.data.get(
            "location",
            ""
        ).strip()

        fulfillment_method = request.data.get(
            "fulfillment_method",
            "pickup"
        )

        notes = request.data.get(
            "notes",
            ""
        ).strip()

        # --------------------------------------------------------
        # VALIDATE CUSTOMER INFORMATION
        # --------------------------------------------------------

        if not full_name:
            raise ValidationError({
                "full_name": "Full name is required."
            })

        if not phone:
            raise ValidationError({
                "phone": "Phone number is required."
            })

        if not email:
            raise ValidationError({
                "email": "Email is required."
            })

        if fulfillment_method not in [
            "pickup",
            "delivery",
        ]:
            raise ValidationError({
                "fulfillment_method": (
                    "Invalid fulfillment method."
                )
            })

        # --------------------------------------------------------
        # GET CART
        # --------------------------------------------------------

        try:
            cart = Cart.objects.get(
                customer=user
            )
        except Cart.DoesNotExist:
            raise ValidationError({
                "cart": "Your cart is empty."
            })

        cart_items = list(
            cart.items.select_related(
                "vehicle",
                "vehicle__brand",
            )
        )

        if not cart_items:
            raise ValidationError({
                "cart": "Your cart is empty."
            })

        # --------------------------------------------------------
        # ATOMIC CHECKOUT
        # --------------------------------------------------------

        with transaction.atomic():

            # ----------------------------------------------------
            # LOCK VEHICLES
            # ----------------------------------------------------

            vehicle_ids = [
                item.vehicle.id
                for item in cart_items
            ]

            locked_vehicles = {
                vehicle.id: vehicle
                for vehicle in (
                    Vehicle.objects
                    .select_for_update()
                    .filter(id__in=vehicle_ids)
                )
            }

            # ----------------------------------------------------
            # VERIFY ALL VEHICLES
            # ----------------------------------------------------

            unavailable_vehicles = []

            for item in cart_items:

                vehicle = locked_vehicles.get(
                    item.vehicle.id
                )

                if not vehicle:
                    unavailable_vehicles.append({
                        "vehicle_id": item.vehicle.id,
                        "message": "Vehicle no longer exists."
                    })
                    continue

                if vehicle.status != "available":
                    unavailable_vehicles.append({
                        "vehicle_id": vehicle.id,
                        "vehicle": str(vehicle),
                        "status": vehicle.status,
                        "message": (
                            "Vehicle is no longer available."
                        ),
                    })

            if unavailable_vehicles:

                raise ValidationError({
                    "vehicles": unavailable_vehicles
                })

            # ----------------------------------------------------
            # CREATE ORDERS + RESERVE VEHICLES
            # ----------------------------------------------------

            created_orders = []

            for item in cart_items:

                vehicle = locked_vehicles[
                    item.vehicle.id
                ]

                # -----------------------------------------------
                # CREATE ORDER
                # -----------------------------------------------

                order = Order.objects.create(
                    customer=user,
                    vehicle=vehicle,
                    price=vehicle.price,
                    full_name=full_name,
                    phone=phone,
                    email=email,
                    location=location,
                    fulfillment_method=fulfillment_method,
                    notes=notes,
                    status="pending",
                )

                created_orders.append(order)

                # -----------------------------------------------
                # RESERVE VEHICLE
                # -----------------------------------------------

                vehicle.status = "reserved"
                vehicle.save(
                    update_fields=[
                        "status",
                        "updated_at",
                    ]
                )

            # ----------------------------------------------------
            # CLEAR CART
            # ----------------------------------------------------

            cart.items.all().delete()

            # ----------------------------------------------------
            # RESPONSE DATA
            # ----------------------------------------------------

            order_data = OrderSerializer(
                created_orders,
                many=True,
                context={
                    "request": request
                }
            ).data

        # --------------------------------------------------------
        # SUCCESS RESPONSE
        # --------------------------------------------------------

        return Response({
            "success": True,
            "message": (
                "Checkout completed successfully. "
                "Your vehicles have been reserved."
            ),
            "orders": order_data,
            "order_count": len(created_orders),
        })
        

# ============================================================
# ADMIN ORDER LIST
# ============================================================

class AdminOrderListView(generics.ListAPIView):
    """
    Admin can view all orders.
    """

    serializer_class = AdminOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if not user.is_staff and not user.is_superuser:
            return Order.objects.none()

        return (
            Order.objects
            .select_related(
                "vehicle",
                "customer",
            )
            .all()
        )


# ============================================================
# ADMIN ORDER DETAIL
# ============================================================

class AdminOrderDetailView(
    generics.RetrieveUpdateAPIView
):
    """
    Admin can:
    - View an order
    - Update its status
    """

    serializer_class = AdminOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if not user.is_staff and not user.is_superuser:
            return Order.objects.none()

        return (
            Order.objects
            .select_related(
                "vehicle",
                "customer",
            )
            .all()
        )

    def perform_update(self, serializer):

        order = self.get_object()

        new_status = self.request.data.get(
            "status"
        )

        allowed_statuses = {
            choice[0]
            for choice in Order.STATUS_CHOICES
        }

        if (
            new_status
            and new_status not in allowed_statuses
        ):
            raise ValidationError({
                "status": "Invalid order status."
            })

        serializer.save()
