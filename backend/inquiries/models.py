from django.db import models
from django.contrib.auth.models import User
from vehicles.models import Vehicle


class Inquiry(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("responded", "Responded"),
        ("closed", "Closed"),
    ]

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="inquiries",
    )

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="inquiries",
    )

    subject = models.CharField(
        max_length=200
    )

    message = models.TextField()

    admin_response = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.customer.username} - "
            f"{self.vehicle} - "
            f"{self.subject}"
        )