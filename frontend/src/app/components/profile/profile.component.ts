import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  mealService = inject(MealService);
  http = inject(HttpClient);

  private apiUrl = 'http://localhost:8000/api';
  profile = signal<any>(null);

  ngOnInit() {
    this.http.get(`${this.apiUrl}/profile/`).subscribe({
      next: (data: any) => this.profile.set(data),
      error: () => console.error('Failed to load profile')
    });
  }

  getInitials(): string {
    const name = this.profile()?.name || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }

  getBMI(): string {
    const weight = parseFloat(this.profile()?.current_weight);
    const height = parseFloat(this.profile()?.height) / 100;
    if (!weight || !height) return '—';
    return (weight / (height * height)).toFixed(1);
  }

  getBMICategory(): string {
    const bmi = parseFloat(this.getBMI());
    if (isNaN(bmi)) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  getBMIColor(): string {
    const bmi = parseFloat(this.getBMI());
    if (isNaN(bmi)) return '#888';
    if (bmi < 18.5) return '#2196f3';
    if (bmi < 25) return '#2e7d32';
    if (bmi < 30) return '#f57c00';
    return '#c62828';
  }

  getRecommendedCalories(): number {
    const p = this.profile();
    if (!p) return 0;

    const weight = parseFloat(p.current_weight);
    const height = parseFloat(p.height);
    const age = p.age;
    const gender = p.gender || 'male';

    if (!weight || !height || !age) return 0;

    // Mifflin-St Jeor
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    const activityMap: any = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9
    };

    return Math.round(bmr * (activityMap[p.activity_level] || 1.55));
  }

  onGoalChange(value: string) {
    this.mealService.setGoal(Number(value));
  }
}