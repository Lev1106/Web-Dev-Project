import { Component, signal, inject } from '@angular/core';
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
export class DashboardComponent {
  mealService = inject(MealService);
  showModal = signal(false);
  newMealName = '';
  newMealKcal: number | null = null;

  openModal() { this.showModal.set(true); this.newMealName = ''; this.newMealKcal = null; }
  closeModal() { this.showModal.set(false); }

  addMeal() {
    if (!this.newMealName.trim() || !this.newMealKcal || this.newMealKcal < 1) return;
    this.mealService.addMeal(this.newMealName.trim(), this.newMealKcal);
    this.closeModal();
  }
}
