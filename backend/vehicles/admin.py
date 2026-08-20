from django.contrib import admin
from .models import Brand, VehicleCategory, Vehicle, VehicleImage


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(VehicleCategory)
class VehicleCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class VehicleImageInline(admin.TabularInline):

    model = VehicleImage

    extra = 1

    fields = (
        "image",
        "is_primary",
    )

    readonly_fields = ()


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):

    list_display = (
        'brand',
        'model',
        'year',
        'price',
        'mileage',
        'condition',
        'status',
        'featured',
    )

    list_filter = (
        'status',
        'condition',
        'fuel_type',
        'transmission',
        'featured',
        'brand',
        'category',
    )

    search_fields = (
        'model',
        'variant',
        'brand__name',
    )

    list_editable = (
        'status',
        'featured',
    )

    inlines = [VehicleImageInline]