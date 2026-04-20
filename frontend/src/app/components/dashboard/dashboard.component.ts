import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  mealService = inject(MealService);

  meals = this.mealService.meals;
  summary = computed(() => {
    const meals = this.mealService.meals();
    const targetCalories = this.mealService.goal();
    const consumedCalories = this.mealService.todayTotal();
    const progressPercent = this.mealService.progressPercent();
    const remainingCalories = Math.max(0, targetCalories - consumedCalories);

    return {
      consumed_calories: consumedCalories,
      target_calories: targetCalories,
      progress_percent: progressPercent,
      remaining_calories: remainingCalories,
      meals_count: meals.length,
      avg_per_meal: this.mealService.avgPerMeal()
    };
  });

  showModal = signal(false);
  newMealName = '';
  newMealKcal: number | null = null;
  newMealTime = '';

  ngOnInit() {
    this.mealService.getGoal().subscribe({
      next: (goal) => this.mealService.goal.set(goal.target_calories)
    });

    this.mealService.getMeals().subscribe({
      next: (meals) => this.mealService.meals.set(meals)
    });
  }

  openModal() {
    this.showModal.set(true);
    this.newMealName = '';
    this.newMealKcal = null;
    const now = new Date();
    this.newMealTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  closeModal() {
    this.showModal.set(false);
  }

  addMeal() {
    if (!this.newMealName.trim() || !this.newMealKcal || this.newMealKcal < 1 || !this.newMealTime) {
      return;
    }

    const [hours, minutes] = this.newMealTime.split(':').map(Number);
    const eatenAt = new Date();
    eatenAt.setHours(hours, minutes, 0, 0);

    this.mealService.addMeal(this.newMealName.trim(), this.newMealKcal, eatenAt.toISOString()).subscribe({
      next: (meal: any) => {
        this.mealService.meals.update(list => {
          // проверяем нет ли уже такого id
          if (list.find(m => m.id === meal.id)) return list;
          return [meal, ...list];
        });
        this.closeModal();
      }
    });
  }

  deleteMeal(id: number) {
    // сразу убираем из UI
    this.mealService.meals.update(list => list.filter(m => m.id !== id));

    this.mealService.deleteMeal(id).subscribe({
      error: () => {
        // если ошибка — перезагружаем с бэкенда
        this.mealService.getTodayMeals().subscribe({
          next: (meals) => this.mealService.meals.set(meals)
        });
      }
    });
  }
}
