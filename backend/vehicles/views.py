from django.db.models import Q, Sum

from rest_framework import viewsets, status
from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Brand,
    VehicleCategory,
    Vehicle,
    VehicleImage,
)

from .serializers import (
    BrandSerializer,
    VehicleCategorySerializer,
    VehicleSerializer,
)


# ============================================================
# ADMIN-ONLY PERMISSION
# ============================================================

class IsAdminOrReadOnly(BasePermission):
    """
    Anyone can read public vehicle information.

    Only authenticated Django staff users can:
        - create
        - update
        - partially update
        - delete
        - upload images
        - delete images
        - set primary image
        - toggle featured
    """

    def has_permission(self, request, view):

        # Public read access
        if request.method in [
            "GET",
            "HEAD",
            "OPTIONS",
        ]:
            return True

        # Write access
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )


# ============================================================
# BRAND
# ============================================================

class BrandViewSet(viewsets.ModelViewSet):

    queryset = Brand.objects.all()

    serializer_class = BrandSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]


# ============================================================
# VEHICLE CATEGORY
# ============================================================

class VehicleCategoryViewSet(viewsets.ModelViewSet):

    queryset = VehicleCategory.objects.all()

    serializer_class = VehicleCategorySerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]


# ============================================================
# VEHICLE
# ============================================================

class VehicleViewSet(viewsets.ModelViewSet):

    serializer_class = VehicleSerializer

    # --------------------------------------------------------
    # PERMISSIONS
    # --------------------------------------------------------

    def get_permissions(self):

        # Anyone can browse vehicles
        if self.action in [
            "list",
            "retrieve",
        ]:
            return [
                AllowAny()
            ]

        # Everything else requires admin
        return [
            IsAdminOrReadOnly()
        ]


    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated]
    )
    def dashboard_stats(self, request):

        # Extra admin protection
        if not request.user.is_staff:
            return Response(
                {
                    "detail": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        vehicles = Vehicle.objects.all()

        total = vehicles.count()

        available = vehicles.filter(
            status='available'
        ).count()

        reserved = vehicles.filter(
            status='reserved'
        ).count()

        sold = vehicles.filter(
            status='sold'
        ).count()

        draft = vehicles.filter(
            status='draft'
        ).count()

        archived = vehicles.filter(
            status='archived'
        ).count()

        featured = vehicles.filter(
            featured=True
        ).count()

        new_vehicles = vehicles.filter(
            condition='new'
        ).count()

        used_vehicles = vehicles.filter(
            condition='used'
        ).count()

        certified_vehicles = vehicles.filter(
            condition='certified'
        ).count()

        inventory_value = (
            vehicles
            .filter(
                status__in=[
                    'available',
                    'reserved'
                ]
            )
            .aggregate(
                total=Sum('price')
            )
            .get('total')
            or 0
        )

        return Response({

            "total": total,

            "available": available,

            "reserved": reserved,

            "sold": sold,

            "draft": draft,

            "archived": archived,

            "featured": featured,

            "new_vehicles": new_vehicles,

            "used_vehicles": used_vehicles,

            "certified_vehicles": certified_vehicles,

            "inventory_value": str(
                inventory_value
            ),

        })



    # --------------------------------------------------------
    # QUERYSET
    # --------------------------------------------------------

    def get_queryset(self):

        queryset = Vehicle.objects.select_related(
            "brand",
            "category",
        ).prefetch_related(
            "images",
        )

        # ----------------------------------------------------
        # SEARCH
        # ----------------------------------------------------

        search = self.request.query_params.get(
            "search"
        )

        if search:

            queryset = queryset.filter(

                Q(
                    model__icontains=search
                )
                |
                Q(
                    variant__icontains=search
                )
                |
                Q(
                    brand__name__icontains=search
                )

            )

        # ----------------------------------------------------
        # BRAND
        # ----------------------------------------------------

        brand = self.request.query_params.get(
            "brand"
        )

        if brand:

            queryset = queryset.filter(
                brand_id=brand
            )

        # ----------------------------------------------------
        # CATEGORY
        # ----------------------------------------------------

        category = self.request.query_params.get(
            "category"
        )

        if category:

            queryset = queryset.filter(
                category_id=category
            )

        # ----------------------------------------------------
        # FUEL
        # ----------------------------------------------------

        fuel_type = self.request.query_params.get(
            "fuel_type"
        )

        if fuel_type:

            queryset = queryset.filter(
                fuel_type=fuel_type
            )

        # ----------------------------------------------------
        # TRANSMISSION
        # ----------------------------------------------------

        transmission = self.request.query_params.get(
            "transmission"
        )

        if transmission:

            queryset = queryset.filter(
                transmission=transmission
            )

        # ----------------------------------------------------
        # CONDITION
        # ----------------------------------------------------

        condition = self.request.query_params.get(
            "condition"
        )

        if condition:

            queryset = queryset.filter(
                condition=condition
            )

        # ----------------------------------------------------
        # STATUS
        # ----------------------------------------------------

        vehicle_status = self.request.query_params.get(
            "status"
        )

        if vehicle_status:

            queryset = queryset.filter(
                status=vehicle_status
            )

        # ----------------------------------------------------
        # MINIMUM PRICE
        # ----------------------------------------------------

        min_price = self.request.query_params.get(
            "min_price"
        )

        if min_price:

            queryset = queryset.filter(
                price__gte=min_price
            )

        # ----------------------------------------------------
        # MAXIMUM PRICE
        # ----------------------------------------------------

        max_price = self.request.query_params.get(
            "max_price"
        )

        if max_price:

            queryset = queryset.filter(
                price__lte=max_price
            )

        # ----------------------------------------------------
        # FEATURED
        # ----------------------------------------------------

        featured = self.request.query_params.get(
            "featured"
        )

        if featured == "true":

            queryset = queryset.filter(
                featured=True
            )

        elif featured == "false":

            queryset = queryset.filter(
                featured=False
            )

        # ----------------------------------------------------
        # SORTING
        # ----------------------------------------------------

        sort = self.request.query_params.get(
            "sort"
        )

        if sort == "price_low":

            queryset = queryset.order_by(
                "price"
            )

        elif sort == "price_high":

            queryset = queryset.order_by(
                "-price"
            )

        elif sort == "oldest":

            queryset = queryset.order_by(
                "created_at"
            )

        else:

            queryset = queryset.order_by(
                "-created_at"
            )

        return queryset

    # ========================================================
    # UPLOAD VEHICLE IMAGES
    # ========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="upload-images",
    )
    def upload_images(self, request, pk=None):

        vehicle = self.get_object()

        images = request.FILES.getlist(
            "images"
        )

        if not images:

            return Response(
                {
                    "detail":
                    "No images were provided."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        created_images = []

        for image in images:

            vehicle_image = VehicleImage.objects.create(
                vehicle=vehicle,
                image=image,
            )

            created_images.append(
                vehicle_image
            )

        serializer = self.get_serializer(
            vehicle
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    # ========================================================
    # SET PRIMARY IMAGE
    # ========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="set-primary-image",
    )
    def set_primary_image(
        self,
        request,
        pk=None,
    ):

        vehicle = self.get_object()

        image_id = request.data.get(
            "image_id"
        )

        if not image_id:

            return Response(
                {
                    "detail":
                    "image_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            image = VehicleImage.objects.get(
                id=image_id,
                vehicle=vehicle,
            )

        except VehicleImage.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Image not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Remove primary status from all
        VehicleImage.objects.filter(
            vehicle=vehicle
        ).update(
            is_primary=False
        )

        # Set selected image as primary
        image.is_primary = True
        image.save()

        serializer = self.get_serializer(
            vehicle
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # ========================================================
    # DELETE VEHICLE IMAGE
    # ========================================================

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"delete-image/(?P<image_id>[0-9]+)",
    )
    def delete_image(
        self,
        request,
        pk=None,
        image_id=None,
    ):

        vehicle = self.get_object()

        try:

            image = VehicleImage.objects.get(
                id=image_id,
                vehicle=vehicle,
            )

        except VehicleImage.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Image not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        image.delete()

        serializer = self.get_serializer(
            vehicle
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # ========================================================
    # TOGGLE FEATURED
    # ========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="toggle-featured",
    )
    def toggle_featured(
        self,
        request,
        pk=None,
    ):

        vehicle = self.get_object()

        featured = request.data.get(
            "featured"
        )

        if featured is None:

            vehicle.featured = (
                not vehicle.featured
            )

        else:

            vehicle.featured = bool(
                featured
            )

        vehicle.save()

        serializer = self.get_serializer(
            vehicle
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )