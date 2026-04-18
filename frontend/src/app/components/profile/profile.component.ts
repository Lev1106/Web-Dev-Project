import { Component, inject, signal } from '@angular/core';
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

  isEditing = signal(false);

  name = signal('Alex Johnson');
  weight = signal(72);
  height = signal(178);
  age = signal(28);
  activityLevel = signal('Moderate');

  // для редактирования
  tempName = '';
  tempWeight = 0;
  tempHeight = 0;
  tempAge = 0;
  tempActivity = '';

  startEdit() {
    this.tempName = this.name();
    this.tempWeight = this.weight();
    this.tempHeight = this.height();
    this.tempAge = this.age();
    this.tempActivity = this.activityLevel();
    this.isEditing.set(true);
  }

  saveEdit() {
    this.name.set(this.tempName);
    this.weight.set(this.tempWeight);
    this.height.set(this.tempHeight);
    this.age.set(this.tempAge);
    this.activityLevel.set(this.tempActivity);
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  getInitials(): string {
    return this.name().split(' ').map(n => n[0]).join('').toUpperCase();
  }

  onGoalChange(value: string) {
    this.mealService.setGoal(Number(value));
  }
}