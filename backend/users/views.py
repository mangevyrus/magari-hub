from django.contrib.auth.models import User

from rest_framework import status

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomerProfile

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import (
    CustomerSerializer,
    CustomerProfileSerializer,
    RegisterSerializer,
    AdminTokenObtainPairSerializer,
)


class AdminTokenObtainPairView(TokenObtainPairView):

    serializer_class = AdminTokenObtainPairSerializer


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
                "message":
                    "Account created successfully.",

                "user":
                    CustomerSerializer(
                        user
                    ).data,
            },
            status=status.HTTP_201_CREATED
        )


class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user = request.user

        return Response(
            CustomerSerializer(
                user
            ).data
        )


class AdminTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):

        # Only staff users can receive an admin token
        if not user.is_staff:
            raise serializers.ValidationError(
                "You are not authorized to access the admin area."
            )

        token = super().get_token(user)

        # Add admin information to JWT
        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser

        return token


class AdminTokenView(TokenObtainPairView):

    serializer_class = AdminTokenSerializer


class ProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get_profile(self, user):

        profile, created = (
            CustomerProfile.objects
            .get_or_create(
                user=user
            )
        )

        return profile

    def get(self, request):

        profile = self.get_profile(
            request.user
        )

        return Response(
            CustomerProfileSerializer(
                profile
            ).data
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
            CustomerSerializer(
                user
            ).data
        )