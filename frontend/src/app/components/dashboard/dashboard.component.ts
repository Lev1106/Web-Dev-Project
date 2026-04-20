import { Component, signal, inject, OnInit } from '@angular/core';
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
  showModal = signal(false);
  newMealName = '';
  newMealKcal: number | null = null;

  ngOnInit() {
    this.mealService.getGoal().subscribe({
      next: (goal) => this.mealService.goal.set(goal.target_calories)
    });

    this.mealService.getTodayMeals().subscribe({
      next: (meals) => this.mealService.meals.set(meals)
    });
  }

  openModal() { this.showModal.set(true); this.newMealName = ''; this.newMealKcal = null; }
  closeModal() { this.showModal.set(false); }

  addMeal() {
    if (!this.newMealName.trim() || !this.newMealKcal || this.newMealKcal < 1) return;
    this.mealService.addMeal(this.newMealName.trim(), this.newMealKcal).subscribe({
      next: (meal) => {
        this.mealService.meals.update(list => [...list, meal]);
        this.closeModal();
      }
    });
  }
  deleteMeal(id: number) {
    this.mealService.deleteMeal(id).subscribe({
      next: () => {
        this.mealService.meals.update(list => list.filter(m => m.id !== id));
      }
    });
  }
}
