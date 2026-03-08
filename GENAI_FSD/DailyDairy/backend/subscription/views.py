from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from .models import Subscription
from .serializers import SubscriptionSerializer, AdminSubscriptionSerializer

class SubscriptionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscriptions = Subscription.objects.filter(customer=request.user)
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(customer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubscriptionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        subscription = get_object_or_404(Subscription, pk=pk, customer=request.user)
        serializer = SubscriptionSerializer(subscription, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        subscription = get_object_or_404(Subscription, pk=pk, customer=request.user)
        subscription.status = 'cancelled'
        subscription.save()
        return Response({'detail': 'Subscription cancelled'}, status=status.HTTP_200_OK)

class AdminSubscriptionView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        subscriptions = Subscription.objects.all()
        serializer = AdminSubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)
