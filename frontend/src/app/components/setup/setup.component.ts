import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-setup',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './setup.component.html',
})
export class SetupComponent {
    firstName = '';
    lastName = '';
    weight = '';
    height = '';
    age = '';
    activityLevel = 'Moderate';
    targetCalories = 2000;
    errorMsg = '';

    private apiUrl = 'http://localhost:8000/api';

    constructor(private router: Router, private http: HttpClient) {}

    save() {
        if (!this.firstName || !this.lastName || !this.weight || !this.height || !this.age) {
            this.errorMsg = 'Please fill in all fields';
            return;
        }

        const profileData = {
            name: `${this.firstName} ${this.lastName}`,
            height: this.height,
            age: this.age,
            activity_level: this.activityLevel
        };

        const goalData = { target_calories: this.targetCalories };

        const weightData = {
            weight: this.weight,
            created_at: new Date().toISOString()
        };

        forkJoin([
            this.http.put(`${this.apiUrl}/profile/`, profileData),
            this.http.put(`${this.apiUrl}/goal/`, goalData),
            this.http.post(`${this.apiUrl}/weights/`, weightData)
        ]).subscribe({
            next: () => {
                localStorage.setItem('profile_setup_done', 'true');
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                this.errorMsg = 'Something went wrong, try again';
            }
        });
    }
}