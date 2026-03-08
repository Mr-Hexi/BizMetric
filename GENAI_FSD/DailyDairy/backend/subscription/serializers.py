from rest_framework import serializers
from .models import Subscription
from product.serializers import ProductSerializer

class SubscriptionSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['customer', 'created_at']

class AdminSubscriptionSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'
