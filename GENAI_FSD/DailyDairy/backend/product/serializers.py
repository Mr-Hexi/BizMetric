from rest_framework import serializers
from .models import Product
from category.serializers import CategorySerializer

class ProductSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
