from api.models import Profile, DailyGoal, Meal, WeightEntry
from api.serializers import RegisterUserSerializer, AboutMeSerializer, ProfileSerializer, DailyGoalSerializer, \
    DashboardSummarySerializer, WeightEntrySerializer
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(CreateAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        Profile.objects.get_or_create(user=user)

class AboutMeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = {
            "id": request.user.id,
            "username": request.user.username,
            "is_authenticated": request.user.is_authenticated,
        }
        serializer = AboutMeSerializer(data)
        return Response(serializer.data)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, user):
        profile, _ = Profile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        profile = self.get_object(request.user)
        serializer = ProfileSerializer(profile)
        last_weight = WeightEntry.objects.filter(user=request.user).order_by("-created_at").first()
        data = serializer.data
        data["current_weight"] = last_weight.weight if last_weight else None
        return Response(data)

    def put(self, request):
        profile = self.get_object(request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"message": "Please provide a refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out"},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )

class DailyGoalView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, user):
        goal, _ = DailyGoal.objects.get_or_create(user=user, defaults={"target_calories": "1850"})
        return goal

    def get(self, request):
        goal = self.get_object(request.user)
        serializer = DailyGoalSerializer(goal)
        return Response(serializer.data)

    def put(self, request):
        goal = self.get_object(request.user)
        serializer = DailyGoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        goal, _ = DailyGoal.objects.get_or_create(user=request.user, defaults={"target_calories": "1850"})
        meals = Meal.objects.filter(user=request.user, eaten_at__date=today)
        consumed_calories = sum(meal.calories for meal in meals)
        remaining_calories = max(0, goal.target_calories - consumed_calories)
        meals_count = meals.count()
        avg_per_meal = consumed_calories / meals_count if meals_count > 0 else 0
        progress_percent = consumed_calories / goal.target_calories * 100 if goal.target_calories > 0 else 0

        data = {
            "date": today,
            "target_calories": goal.target_calories,
            "consumed_calories": consumed_calories,
            "remaining_calories": remaining_calories,
            "progress_percent": round(progress_percent, 2),
            "meals_count": meals_count,
            "avg_per_meal": round(avg_per_meal, 2)
        }
        serializer = DashboardSummarySerializer(data)
        return Response(serializer.data)


class WeightEntryListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = WeightEntry.objects.filter(user=request.user).order_by("-created_at")
        serializer = WeightEntrySerializer(entries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WeightEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WeightEntryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, weight_id, user):
        try:
            return WeightEntry.objects.get(id=weight_id, user=user)
        except WeightEntry.DoesNotExist:
            return None

    def get(self, request, weight_id):
        entry = self.get_object(weight_id, request.user)
        if entry is None:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = WeightEntrySerializer(entry)
        return Response(serializer.data)

    def put(self, request, weight_id):
        entry = self.get_object(weight_id, request.user)
        if entry is None:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = WeightEntrySerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, weight_id):
        entry = self.get_object(weight_id, request.user)
        if entry is None:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)