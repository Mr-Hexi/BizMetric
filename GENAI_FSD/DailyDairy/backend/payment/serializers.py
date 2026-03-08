from rest_framework import serializers
from .models import Payment
import uuid

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['customer', 'transaction_id', 'payment_status', 'payment_date']

class PaymentProcessSerializer(serializers.Serializer):
    subscription_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHOD_CHOICES)

    def validate(self, attrs):
        # Additional validation can go here
        return attrs

    def save(self, customer):
        import uuid
        transaction_id = str(uuid.uuid4())
        
        return Payment.objects.create(
            customer=customer,
            subscription_id=self.validated_data['subscription_id'],
            amount=self.validated_data['amount'],
            payment_method=self.validated_data['payment_method'],
            payment_status='completed', # Simulate mock payment success
            transaction_id=transaction_id
        )
