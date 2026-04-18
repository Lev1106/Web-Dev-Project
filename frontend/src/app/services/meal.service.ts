import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Meal } from '../models/meal.model';

@Injectable({ providedIn: 'root' })
export class MealService {
  private apiUrl = 'http://localhost:8000/api';
  errorMsg = signal<string>('');
  private nextId = 10;

  constructor(private http: HttpClient) {}

  getMeals() {
    return this.http.get<Meal[]>(`${this.apiUrl}/meals/`).pipe(
        catchError(err => {
          this.errorMsg.set('Не удалось загрузить приёмы пищи');
          return throwError(() => err);
        })
    );
  }
  meals = signal<Meal[]>([
    { id: 1, name: 'Breakfast: Oatmeal & Berries', kcal: 450, time: '08:00', date: 'today' },
    { id: 2, name: 'Lunch', kcal: 380, time: '13:00', date: 'today' },
    { id: 3, name: 'Lunch: Chicken Salad', kcal: 580, time: '14:30', date: 'today' },
    { id: 4, name: 'Dinner: Salmon & Veggies', kcal: 520, time: '19:00', date: 'today' },
  ]);

  historyMeals = signal<Meal[]>([
    { id: 5, name: 'Pancakes & Syrup', kcal: 620, time: '08:30', date: 'yesterday' },
    { id: 6, name: 'Caesar Salad', kcal: 410, time: '13:00', date: 'yesterday' },
    { id: 7, name: 'Grilled Chicken', kcal: 520, time: '19:00', date: 'yesterday' },
    { id: 8, name: 'Greek Yogurt', kcal: 150, time: '21:00', date: 'yesterday' },
    { id: 9, name: 'Avocado Toast', kcal: 380, time: '09:00', date: 'apr11' },
  ]);

  goal = signal<number>(2000);

  todayTotal = computed(() =>
    this.meals().reduce((sum, m) => sum + m.kcal, 0)
  );

  progressPercent = computed(() =>
    Math.min(100, Math.round((this.todayTotal() / this.goal()) * 100))
  );

  avgPerMeal = computed(() => {
    const m = this.meals();
    return m.length ? Math.round(m.reduce((s, x) => s + x.kcal, 0) / m.length) : 0;
  });

  addMeal(name: string, kcal: number) {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    this.meals.update(list => [...list, { id: this.nextId++, name, kcal, time, date: 'today' }]);
  }

  deleteMeal(id: number) {
    this.meals.update(list => list.filter(m => m.id !== id));
  }

  setGoal(g: number) {
    this.goal.set(g);
  }

  allHistory = computed(() => {
    const todayMeals = this.meals().map(m => ({ ...m, dateLabel: "Today, Apr 13" }));
    const yesterdayMeals = this.historyMeals()
      .filter(m => m.date === 'yesterday')
      .map(m => ({ ...m, dateLabel: "Yesterday, Apr 12" }));
    const apr11Meals = this.historyMeals()
      .filter(m => m.date === 'apr11')
      .map(m => ({ ...m, dateLabel: "Apr 11" }));

    const grouped: { [key: string]: (Meal & { dateLabel: string })[] } = {};
    [...todayMeals, ...yesterdayMeals, ...apr11Meals].forEach(m => {
      if (!grouped[m.dateLabel]) grouped[m.dateLabel] = [];
      grouped[m.dateLabel].push(m);
    });

    return Object.entries(grouped).map(([date, meals]) => ({
      date,
      meals,
      total: meals.reduce((s, m) => s + m.kcal, 0)
    }));
  });
}
