from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from . import serializers
from .permissions import IsOwnerOfObject
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model


class UserViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the User model 
    with extra action for changing password
    """

    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer
    authentication_classes = (JWTAuthentication,)

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list' or self.action == 'create':
            permission_classes = []
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOfObject]
        return [permission() for permission in permission_classes]
    

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request, pk=None):
        """
        View for changing password.
        """
        user = self.get_object()
        serializer = serializers.ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data.get("old_password")
            password = serializer.validated_data.get("password")

            # Check if old password is correct
            if not user.check_password(old_password):
                return Response({"old_password": ["Неверный пароль."]}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            # Check if old password different from new
            if old_password == password:
                return Response({"password": ["Новый пароль должен отличаться от старого."]}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            # set_password also hashes the password that the user will get
            user.set_password(password)

            user.raw_password = password # for demonstration purposes only!!!!!!!!!!!!!!

            user.save()

            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    