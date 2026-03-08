from django.db import models
from django.contrib.auth.models import AbstractUser

class Customer(AbstractUser):
    # username is already handled by AbstractUser (required by default)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
