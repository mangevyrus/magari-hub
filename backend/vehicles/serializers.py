from rest_framework import serializers

from .models import (
    Brand,
    VehicleCategory,
    Vehicle,
    VehicleImage,
)


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = "__all__"


class VehicleCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = VehicleCategory
        fields = "__all__"


class VehicleImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = VehicleImage
        fields = [
            "id",
            "image",
            "is_primary",
        ]


class VehicleImageUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = VehicleImage

        fields = [
            "id",
            "vehicle",
            "image",
            "is_primary",
        ]

        read_only_fields = [
            "id",
            "vehicle",
        ]


class VehicleSerializer(serializers.ModelSerializer):

    brand_name = serializers.CharField(
        source="brand.name",
        read_only=True
    )

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    images = VehicleImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Vehicle

        fields = [
            "id",

            "brand",
            "brand_name",

            "category",
            "category_name",

            "model",
            "variant",

            "year",

            "price",
            "mileage",

            "condition",
            "status",

            "fuel_type",
            "transmission",

            "engine_size",
            "horsepower",
            "drivetrain",

            "seats",
            "doors",

            "exterior_color",
            "interior_color",

            "description",
            "location",

            "featured",

            "images",

            "created_at",
            "updated_at",
        ]

    def to_representation(self, instance):

        representation = super().to_representation(
            instance
        )

        images = representation.get(
            "images",
            []
        )

        # Put primary image first
        images.sort(
            key=lambda image:
                not image.get(
                    "is_primary",
                    False
                )
        )

        representation["images"] = images

        return representation