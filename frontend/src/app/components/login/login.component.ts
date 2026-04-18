import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
    username = '';
    password = '';
    errorMsg = '';
    successMsg = '';
    isRegisterMode = false;

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit() {
        // очищаем токен при каждом открытии страницы логина
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    login() {
        this.errorMsg = '';
        this.auth.login(this.username, this.password).subscribe({
            next: () => {
                const setupDone = localStorage.getItem('profile_setup_done');
                if (setupDone) {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/setup']);
                }
            },
            error: () => this.errorMsg = 'Invalid username or password'
        });
    }

    register() {
        this.errorMsg = '';
        this.successMsg = '';
        this.auth.register(this.username, this.password).subscribe({
            next: () => {
                // после регистрации сразу логинимся и идём на setup
                this.auth.login(this.username, this.password).subscribe({
                    next: () => this.router.navigate(['/setup']),
                    error: () => this.errorMsg = 'Registration successful, please sign in'
                });
            },
            error: () => this.errorMsg = 'Registration failed'
        });
    }
}