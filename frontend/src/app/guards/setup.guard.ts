import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const setupGuard: CanActivateFn = () => {
    const router = inject(Router);
    const done = localStorage.getItem('profile_setup_done');

    if (done) return true;

    router.navigate(['/setup']);
    return false;
};