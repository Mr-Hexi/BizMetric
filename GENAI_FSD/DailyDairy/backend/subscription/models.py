from django.db import models
from customer.models import Customer
from product.models import Product

class Subscription(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('alternate_days', 'Alternate Days'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='subscriptions')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='subscriptions')
    quantity = models.PositiveIntegerField(default=1)
    
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    delivery_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} - {self.product.name} ({self.delivery_frequency})"
