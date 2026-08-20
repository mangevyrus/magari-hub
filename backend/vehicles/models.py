from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class VehicleCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Vehicle(models.Model):

    CONDITION_CHOICES = [
        ('new', 'New'),
        ('used', 'Used'),
        ('certified', 'Certified Pre-Owned'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
        ('draft', 'Draft'),
        ('archived', 'Archived'),
    ]

    FUEL_CHOICES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('hybrid', 'Hybrid'),
        ('electric', 'Electric'),
    ]

    TRANSMISSION_CHOICES = [
        ('automatic', 'Automatic'),
        ('manual', 'Manual'),
        ('cvt', 'CVT'),
    ]

    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name='vehicles'
    )

    category = models.ForeignKey(
        VehicleCategory,
        on_delete=models.PROTECT,
        related_name='vehicles'
    )

    model = models.CharField(max_length=150)
    variant = models.CharField(max_length=150, blank=True)

    year = models.PositiveIntegerField()

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    mileage = models.PositiveIntegerField(default=0)

    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default='used'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available'
    )

    fuel_type = models.CharField(
        max_length=20,
        choices=FUEL_CHOICES
    )

    transmission = models.CharField(
        max_length=20,
        choices=TRANSMISSION_CHOICES
    )

    engine_size = models.CharField(
        max_length=50,
        blank=True
    )

    horsepower = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    drivetrain = models.CharField(
        max_length=50,
        blank=True
    )

    seats = models.PositiveIntegerField(
        default=5
    )

    doors = models.PositiveIntegerField(
        default=4
    )

    exterior_color = models.CharField(
        max_length=50,
        blank=True
    )

    interior_color = models.CharField(
        max_length=50,
        blank=True
    )

    description = models.TextField()

    location = models.CharField(
        max_length=150,
        blank=True
    )

    featured = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand.name} {self.model} ({self.year})"

class VehicleImage(models.Model):

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="vehicles/"
    )

    is_primary = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):

        if self.is_primary:

            VehicleImage.objects.filter(
                vehicle=self.vehicle,
                is_primary=True
            ).exclude(
                pk=self.pk
            ).update(
                is_primary=False
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return f"{self.vehicle} - Image {self.id}"