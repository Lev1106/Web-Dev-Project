from api.models import Profile, Meal, WeightEntry, DailyGoal
from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            "password": {"write_only": True}
        }
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ("user",)

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class DailyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyGoal
        fields = '__all__'
        read_only_fields = ('user', 'updated_at')


class WeightEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightEntry
        fields = '__all__'
        read_only_fields = ('user', )

class AboutMeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    is_authenticated = serializers.BooleanField()

class DashboardSummarySerializer(serializers.Serializer):
    date = serializers.DateField()
    target_calories = serializers.IntegerField()
    consumed_calories = serializers.IntegerField()
    remaining_calories = serializers.IntegerField()
    progress_percent = serializers.FloatField()
    meals_count = serializers.IntegerField()
    avg_per_meal = serializers.FloatField()