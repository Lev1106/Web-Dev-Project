import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  meals = signal<any[]>([]);
  summary = signal<any>(null);
  showModal = signal(false);
  newMealName = '';
  newMealKcal: number | null = null;
  newMealType = 'snack';
  errorMsg = '';

  ngOnInit() {
    this.loadSummary();
    this.loadMeals();
  }

  loadSummary() {
    this.http.get(`${this.apiUrl}/dashboard/summary/`).subscribe({
      next: (data: any) => this.summary.set(data),
      error: () => console.error('Failed to load summary')
    });
  }

  loadMeals() {
    this.http.get<any[]>(`${this.apiUrl}/meals/`).subscribe({
      next: (data) => this.meals.set(data),
      error: () => console.error('Failed to load meals')
    });
  }

  openModal() {
    this.showModal.set(true);
    this.newMealName = '';
    this.newMealKcal = null;
    this.errorMsg = '';
  }

  closeModal() { this.showModal.set(false); }

  addMeal() {
    if (!this.newMealName.trim() || !this.newMealKcal || this.newMealKcal < 1) return;

    const meal = {
      title: this.newMealName.trim(),
      calories: this.newMealKcal,
      meal_type: this.newMealType,
      eaten_at: new Date().toISOString()
    };

    this.http.post(`${this.apiUrl}/meals/`, meal).subscribe({
      next: () => {
        this.closeModal();
        this.loadMeals();
        this.loadSummary();
      },
      error: () => this.errorMsg = 'Failed to add meal'
    });
  }

  deleteMeal(id: number) {
    this.http.delete(`${this.apiUrl}/meals/${id}/`).subscribe({
      next: () => {
        this.loadMeals();
        this.loadSummary();
      },
      error: () => console.error('Failed to delete meal')
    });
  }
}