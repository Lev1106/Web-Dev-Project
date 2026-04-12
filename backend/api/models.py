from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100, blank=True, verbose_name="Full name")
    bio = models.TextField(max_length=1000, verbose_name="Biography")

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"


class DailyGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="daily_goals")
    target_calories = models.PositiveIntegerField(default=1850, verbose_name="Target calories")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}. {self.target_calories} calories"

    class Meta:
        verbose_name = "Daily goal"
        verbose_name_plural = "Daily goals"


class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meals")
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ]
    title = models.CharField(max_length=100, blank=True, verbose_name="Title")
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES, default='snack', verbose_name="Type of meal")
    calories = models.PositiveIntegerField(default=0, verbose_name="Calories")
    eaten_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title}, {self.calories} calories"

    class Meta:
        verbose_name = "Meal"
        verbose_name_plural = "Meals"


class WeightEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meals")
    weight = models.DecimalField(default=0, decimal_places=2, verbose_name="Weight")
    created_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user.username} -  {self.weight} kg"

    class Meta:
        verbose_name = "Meal"
        verbose_name_plural = "Meals"