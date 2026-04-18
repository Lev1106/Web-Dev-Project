import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  mealService = inject(MealService);

  profile = JSON.parse(localStorage.getItem('user_profile') || '{}');

  getInitials(): string {
    const f = this.profile.firstName?.[0] || '';
    const l = this.profile.lastName?.[0] || '';
    return (f + l).toUpperCase();
  }

  onGoalChange(value: string) {
    this.mealService.setGoal(Number(value));
  }
}