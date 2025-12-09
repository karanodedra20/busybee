import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for the auth state to settle by using the user$ observable
  return authService.user$.pipe(
    take(1), // Take only the first emission
    map((user) => {
      if (user) {
        return true;
      }
      // Redirect to login if not authenticated
      return router.createUrlTree(['/login']);
    })
  );
};
