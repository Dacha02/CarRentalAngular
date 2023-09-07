import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TokenRefreshService} from "../shared/services/service/token-refresh.service";
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
    providedIn: 'root'
})
export class LogedOutGuard implements CanActivate {
    constructor(
        private router: Router
    ) {
    }

    canActivate(): boolean {
        const token = localStorage.getItem('token');

        // Check if the user is logged in by verifying the presence of a token
        if (token) {
            // User is logged in, allow access to the protected pages
            return true;
        } else {
            // User is not logged in, redirect to the login page
            this.router.navigate(['/login']);
            return false;
        }

    }
}

