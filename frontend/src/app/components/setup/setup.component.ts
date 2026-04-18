import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    goal = 'lose_weight';

    constructor(private router: Router) {}

    save() {
        const profile = {
            firstName: this.firstName,
            lastName: this.lastName,
            weight: this.weight,
            height: this.height,
            age: this.age,
            goal: this.goal
        };
        localStorage.setItem('user_profile', JSON.stringify(profile));
        localStorage.setItem('profile_setup_done', 'true');
        this.router.navigate(['/dashboard']);
    }
}