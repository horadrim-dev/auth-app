from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager


class AppUser(AbstractUser):
    raw_password = models.CharField(max_length=150, blank=True, null=True)
