from api.models import Meal
from api.serializers import MealSerializer
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def meals_list(request):
    if request.method == "GET":
        today = request.query_params.get("today")
        meals = Meal.objects.filter(user=request.user)

        if today == "true":
            meals = meals.filter(eaten_at__date=timezone.localdate())

        meals = meals.order_by("-eaten_at")

        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)
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