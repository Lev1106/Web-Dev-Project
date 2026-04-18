import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { SetupComponent } from './components/setup/setup.component';
import { authGuard } from './guards/auth.guard';
import { setupGuard } from './guards/setup.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'setup', component: SetupComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, setupGuard] },
    { path: 'history', component: HistoryComponent, canActivate: [authGuard, setupGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard, setupGuard] },
];