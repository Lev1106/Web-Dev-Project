import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{
  mealService = inject(MealService);
  ngOnInit() {
    this.mealService.getHistoryMeals();
    this.mealService.getGoal();
  }
}
