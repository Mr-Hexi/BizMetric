from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer, PaymentProcessSerializer

class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(customer=request.user)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

class ProcessPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentProcessSerializer(data=request.data)
        if serializer.is_valid():
            payment = serializer.save(customer=request.user)
            return Response({
                'detail': 'Payment processed successfully',
                'data': PaymentSerializer(payment).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
