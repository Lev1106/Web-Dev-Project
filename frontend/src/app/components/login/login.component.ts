import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    username = '';
    password = '';
    errorMsg = '';
    successMsg = '';
    isRegisterMode = false;

    constructor(private auth: AuthService, private router: Router) {}

    login() {
        this.errorMsg = '';
        this.auth.login(this.username, this.password).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err) => this.errorMsg = err.message
        });
    }

    register() {
        this.errorMsg = '';
        this.successMsg = '';
        this.auth.register(this.username, this.password).subscribe({
            next: () => {
                this.successMsg = 'Account successfully registered';
                this.isRegisterMode = false;
            },
            error: (err) => this.errorMsg = 'Registration failed'
        });
    }
}