import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from category.models import Category
from product.models import Product

# Categories
milk_cat, _ = Category.objects.get_or_create(name='Milk', description='Fresh cow and buffalo milk')
curd_cat, _ = Category.objects.get_or_create(name='Curd', description='Thick artisanal curd')
paneer_cat, _ = Category.objects.get_or_create(name='Paneer', description='Soft farm-fresh paneer')

# Products
Product.objects.get_or_create(
    name='Fresh Cow Milk - 1L',
    price=65.00,
    category=milk_cat,
    stock_quantity=100,
    description='100% pure organic cow milk delivered straight from farms.'
)

Product.objects.get_or_create(
    name='Buffalo Full Cream Milk - 1L',
    price=85.00,
    category=milk_cat,
    stock_quantity=100,
    description='Rich and creamy buffalo milk, perfect for making sweets and ghee.'
)

Product.objects.get_or_create(
    name='Farm Curd - 500g',
    price=45.00,
    category=curd_cat,
    stock_quantity=50,
    description='Probiotic-rich thick curd naturally set.'
)

Product.objects.get_or_create(
    name='Malai Paneer - 250g',
    price=120.00,
    category=paneer_cat,
    stock_quantity=30,
    description='Super soft malai paneer vacuum packed for freshness.'
)

print("Database seeded successfully with test products!")
