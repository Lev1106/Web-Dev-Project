import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient, private router: Router) {}

    login(username: string, password: string) {
        return this.http.post<{ access: string; refresh: string }>(
            `${this.apiUrl}/auth/login/`, { username, password }
        ).pipe(
            tap(tokens => {
                localStorage.setItem('access_token', tokens.access);
                localStorage.setItem('refresh_token', tokens.refresh);
            }),
            catchError(() => throwError(() => new Error('Wrong password or username')))
        );
    }

    register(username: string, password: string) {
        return this.http.post(
            `${this.apiUrl}/auth/register/`, { username, password }
        ).pipe(
            catchError(() => throwError(() => new Error('Register error')))
        );
    }

    logout() {
      return this.http.post<{ message: string }>(
        `${this.apiUrl}/auth/logout/`,
        { refresh: localStorage.getItem('refresh_token') }
      ).pipe(
        tap(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigate(['/login']);
        }),
        catchError(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigate(['/login']);
          return throwError(() => new Error('Logout failed'));
        })
      );
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('access_token');
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }
}
