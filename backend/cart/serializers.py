from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    """
    Returns cart item information together with
    the vehicle information needed by the frontend.
    """

    vehicle_name = serializers.CharField(
        source="vehicle",
        read_only=True,
    )

    brand_name = serializers.CharField(
        source="vehicle.brand.name",
        read_only=True,
    )

    price = serializers.DecimalField(
        source="vehicle.price",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    status = serializers.CharField(
        source="vehicle.status",
        read_only=True,
    )

    image = serializers.SerializerMethodField(
        read_only=True
    )

    class Meta:
        model = CartItem

        fields = [
            "id",
            "vehicle",
            "vehicle_name",
            "brand_name",
            "price",
            "status",
            "image",
            "added_at",
        ]

        read_only_fields = [
            "id",
            "vehicle_name",
            "brand_name",
            "price",
            "status",
            "image",
            "added_at",
        ]

    def get_image(self, obj):
        """
        Return the primary vehicle image.
        Falls back to the first image if no primary
        image exists.
        """

        request = self.context.get("request")

        image = (
            obj.vehicle.images
            .filter(is_primary=True)
            .first()
        )

        if not image:
            image = (
                obj.vehicle.images
                .first()
            )

        if not image or not image.image:
            return None

        image_url = image.image.url

        if request:
            return request.build_absolute_uri(
                image_url
            )

        return image_url


class CartSerializer(serializers.ModelSerializer):
    """
    Returns the customer's complete cart.
    """

    items = CartItemSerializer(
        many=True,
        read_only=True,
    )

    item_count = serializers.SerializerMethodField()

    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart

        fields = [
            "id",
            "items",
            "item_count",
            "total",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "items",
            "item_count",
            "total",
            "created_at",
            "updated_at",
        ]

    def get_item_count(self, obj):
        return obj.items.count()

    def get_total(self, obj):
        total = sum(
            item.vehicle.price
            for item in obj.items.select_related(
                "vehicle"
            )
            if item.vehicle.status == "available"
        )

        return total