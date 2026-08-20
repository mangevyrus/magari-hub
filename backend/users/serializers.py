from django.contrib.auth.models import User

from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomerProfile


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):

        data = super().validate(attrs)

        if not self.user.is_staff:

            raise serializers.ValidationError(
                "You do not have permission to access the admin dashboard."
            )

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "is_staff": self.user.is_staff,
            "is_superuser": self.user.is_superuser,
        }

        return data

class CustomerProfileSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = CustomerProfile

        fields = [
            "phone",
            "address",
            "city",
            "country",
            "profile_image",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "created_at",
            "updated_at",
        ]

class CustomerSerializer(
    serializers.ModelSerializer
):

    profile = CustomerProfileSerializer(
        source="customer_profile",
        read_only=True
    )

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_superuser",
            "profile",
        ]

        read_only_fields = [
            "id",
            "username",
            "is_staff",
            "is_superuser",
        ]

class RegisterSerializer(
    serializers.ModelSerializer
):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password_confirm = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User

        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "password_confirm",
        ]

    def validate_username(self, value):

        if User.objects.filter(
            username__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate_email(self, value):

        if User.objects.filter(
            email__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate(self, data):

        if data["password"] != data["password_confirm"]:

            raise serializers.ValidationError({
                "password_confirm":
                "Passwords do not match."
            })

        return data

    def create(self, validated_data):

        validated_data.pop(
            "password_confirm"
        )

        password = validated_data.pop(
            "password"
        )

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        CustomerProfile.objects.create(
            user=user
        )

        return user