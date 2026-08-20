from rest_framework.routers import DefaultRouter

from .views import (
    BrandViewSet,
    VehicleCategoryViewSet,
    VehicleViewSet,
)


router = DefaultRouter()


router.register(
    "brands",
    BrandViewSet,
    basename="brand"
)


router.register(
    "categories",
    VehicleCategoryViewSet,
    basename="category"
)


router.register(
    "vehicles",
    VehicleViewSet,
    basename="vehicle"
)


urlpatterns = router.urls