
from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomerProfile
from .serializers import (
    CustomerSerializer,
    CustomerProfileSerializer,
    RegisterSerializer,
    AdminTokenObtainPairSerializer,
    AdminUserListSerializer,
    AdminUserDetailSerializer,
)


# ============================================================
# ADMIN TOKEN
# ============================================================

class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


# ============================================================
# CUSTOMER REGISTRATION
# ============================================================

class RegisterView(APIView):

    permission_classes = [
        AllowAny
    ]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        return Response(
            {
                "message": "Account created successfully.",
                "user": CustomerSerializer(user).data,
            },
            status=status.HTTP_201_CREATED
        )


# ============================================================
# CURRENT USER
# ============================================================

class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user = request.user

        return Response(
            CustomerSerializer(user).data
        )


# ============================================================
# ADMIN TOKEN SERIALIZER
# ============================================================

class AdminTokenSerializer(
    TokenObtainPairSerializer
):

    @classmethod
    def get_token(cls, user):

        if not user.is_staff:

            raise serializers.ValidationError(
                "You are not authorized to access the admin area."
            )

        token = super().get_token(user)

        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser

        return token


# ============================================================
# ADMIN TOKEN VIEW
# ============================================================

class AdminTokenView(
    TokenObtainPairView
):

    serializer_class = AdminTokenSerializer


# ============================================================
# CUSTOMER PROFILE
# ============================================================

class ProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get_profile(self, user):

        profile, created = (
            CustomerProfile.objects.get_or_create(
                user=user
            )
        )

        return profile

    def get(self, request):

        profile = self.get_profile(
            request.user
        )

        return Response(
            CustomerProfileSerializer(profile).data
        )

    def patch(self, request):

        profile = self.get_profile(
            request.user
        )

        serializer = CustomerProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data
        )


# ============================================================
# ACCOUNT
# ============================================================

class AccountView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def patch(self, request):

        user = request.user

        allowed_fields = [
            "first_name",
            "last_name",
            "email",
        ]

        for field in allowed_fields:

            if field in request.data:

                setattr(
                    user,
                    field,
                    request.data[field]
                )

        user.save()

        return Response(
            CustomerSerializer(user).data
        )


# ============================================================
# ADMIN — CUSTOMER LIST
# ============================================================

class AdminCustomerListView(APIView):

    permission_classes = [
        IsAdminUser
    ]

    def get(self, request):

        # Only normal customers.
        # Staff and superusers are excluded.
        queryset = (
            User.objects
            .filter(
                is_staff=False,
                is_superuser=False
            )
            .select_related(
                "customer_profile"
            )
            .prefetch_related(
                "orders",
                "inquiries"
            )
            .order_by("-date_joined")
        )

        # ----------------------------------------------------
        # SEARCH
        # ----------------------------------------------------

        search = request.query_params.get(
            "search",
            ""
        ).strip()

        if search:

            queryset = queryset.filter(

                Q(username__icontains=search)
                |
                Q(first_name__icontains=search)
                |
                Q(last_name__icontains=search)
                |
                Q(email__icontains=search)
                |
                Q(
                    customer_profile__phone__icontains=search
                )
                |
                Q(
                    customer_profile__city__icontains=search
                )

            )

        # ----------------------------------------------------
        # STATUS FILTER
        # ----------------------------------------------------

        status_filter = request.query_params.get(
            "status"
        )

        if status_filter == "active":

            queryset = queryset.filter(
                is_active=True
            )

        elif status_filter == "inactive":

            queryset = queryset.filter(
                is_active=False
            )

        # ----------------------------------------------------
        # SERIALIZE
        # ----------------------------------------------------

        serializer = AdminUserListSerializer(
            queryset,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# ADMIN — CUSTOMER DETAIL
# ============================================================

class AdminCustomerDetailView(APIView):

    permission_classes = [
        IsAdminUser
    ]

    def get_user(self, user_id):

        return (
            User.objects
            .filter(
                id=user_id,
                is_staff=False,
                is_superuser=False
            )
            .select_related(
                "customer_profile"
            )
            .prefetch_related(
                "orders",
                "inquiries"
            )
            .first()
        )

    def get(self, request, user_id):

        user = self.get_user(user_id)

        if not user:

            return Response(
                {
                    "detail": "Customer not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AdminUserDetailSerializer(
            user
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# ADMIN — CUSTOMER STATUS
# ============================================================

class AdminCustomerStatusView(APIView):

    permission_classes = [
        IsAdminUser
    ]

    def patch(self, request, user_id):

        try:

            user = User.objects.get(
                id=user_id,
                is_staff=False,
                is_superuser=False
            )

        except User.DoesNotExist:

            return Response(
                {
                    "detail": "Customer not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        is_active = request.data.get(
            "is_active"
        )

        if not isinstance(
            is_active,
            bool
        ):

            return Response(
                {
                    "detail":
                        "is_active must be true or false."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = is_active

        user.save(
            update_fields=["is_active"]
        )

        return Response(
            {
                "message":
                    "Customer status updated successfully.",
                "is_active":
                    user.is_active
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# ADMIN — DELETE CUSTOMER
# ============================================================

class AdminCustomerDeleteView(APIView):

    permission_classes = [
        IsAdminUser
    ]

    def delete(self, request, user_id):

        try:

            user = User.objects.get(
                id=user_id,
                is_staff=False,
                is_superuser=False
            )

        except User.DoesNotExist:

            return Response(
                {
                    "detail": "Customer not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        username = user.username

        user.delete()

        return Response(
            {
                "message":
                    f"Customer '{username}' deleted successfully."
            },
            status=status.HTTP_200_OK
        )
