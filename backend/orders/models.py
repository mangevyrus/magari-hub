
from django.db import models
from django.contrib.auth.models import User
from vehicles.models import Vehicle


class Order(models.Model):

    # ============================================================
    # ORDER STATUS
    # ============================================================

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    # ============================================================
    # CUSTOMER
    # ============================================================

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders",
    )

    # ============================================================
    # VEHICLE
    # ============================================================

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.PROTECT,
        related_name="orders",
    )

    # ============================================================
    # ORDER INFORMATION
    # ============================================================

    order_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    # ============================================================
    # CUSTOMER CONTACT INFORMATION
    # ============================================================

    full_name = models.CharField(
        max_length=150,
    )

    phone = models.CharField(
        max_length=30,
    )

    email = models.EmailField()

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    # ============================================================
    # DELIVERY / PICKUP
    # ============================================================

    DELIVERY_CHOICES = [
        ("pickup", "Pickup"),
        ("delivery", "Delivery"),
    ]

    fulfillment_method = models.CharField(
        max_length=20,
        choices=DELIVERY_CHOICES,
        default="pickup",
    )

    # ============================================================
    # CUSTOMER NOTES
    # ============================================================

    notes = models.TextField(
        blank=True,
    )

    # ============================================================
    # TIMESTAMPS
    # ============================================================

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    # ============================================================
    # META
    # ============================================================

    class Meta:
        ordering = ["-created_at"]

    # ============================================================
    # ORDER NUMBER
    # ============================================================

    def save(self, *args, **kwargs):

        if not self.order_number:

            last_order = (
                Order.objects
                .order_by("-id")
                .first()
            )

            next_id = (
                last_order.id + 1
                if last_order
                else 1
            )

            self.order_number = f"MGH-{next_id:05d}"

        super().save(*args, **kwargs)

    # ============================================================
    # STRING REPRESENTATION
    # ============================================================

    def __str__(self):
        return (
            f"{self.order_number} - "
            f"{self.customer.username} - "
            f"{self.vehicle}"
        )

