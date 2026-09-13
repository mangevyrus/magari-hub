from django.db import models
from django.contrib.auth.models import User

from vehicles.models import Vehicle


class Cart(models.Model):
    """
    One active shopping cart per customer.
    """

    customer = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Cart - {self.customer.username}"


class CartItem(models.Model):
    """
    A vehicle inside a customer's cart.

    A vehicle can only appear once in a customer's cart.
    """

    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="cart_items",
    )

    added_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-added_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["cart", "vehicle"],
                name="unique_vehicle_per_cart",
            )
        ]

    def __str__(self):
        return (
            f"{self.cart.customer.username} - "
            f"{self.vehicle}"
        )