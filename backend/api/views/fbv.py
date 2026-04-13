from api.models import Profile, Meal
from backend.api.serializers import RegisterUserSerializer, AboutMeSerializer, ProfileSerializer, MealSerializer
from django.db.migrations import serializer
from rest_framework import status, permissions
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def meals_list(request):
    if request.method == "GET":
        meals = Meal.objects.filter(user=request.user).order_by("-eaten_at")
        serializers = MealSerializer(meals, many=True)
        return Response(serializers.data)
    serializer = MealSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def meal_detail(request, meal_id):
    try:
        meal = Meal.objects.get(id=meal_id, user=request.user)
    except Meal.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = MealSerializer(meal)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = MealSerializer(meal, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        meal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)