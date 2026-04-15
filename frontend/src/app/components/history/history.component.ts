import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  mealService = inject(MealService);
}
