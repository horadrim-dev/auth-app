import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    // Guard that requires to be logged in

    constructor(
        private router: Router,
        private _authService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this._authService.currentUserValue;
        if (currentUser) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to /
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}