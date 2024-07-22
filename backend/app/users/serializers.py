from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    """User model serializer"""

    password = serializers.CharField(required=True, write_only=True, validators=[validate_password])

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'password', 'raw_password', 'first_name', 'last_name')
    
    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        user.raw_password = validated_data['password']  # for demonstration purposes only
        user.save()
        return user

class ChangePasswordSerializer(serializers.ModelSerializer):
    """Serializer for changing password request"""

    old_password = serializers.CharField(required=True, write_only=True, )
    password = serializers.CharField(required=True, write_only=True, validators=[validate_password])

    class Meta:
        model = get_user_model()
        fields = ('old_password', 'password',)