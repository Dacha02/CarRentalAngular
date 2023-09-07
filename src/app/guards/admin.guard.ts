import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private router: Router,
                private jwtHelper: JwtHelperService) {
    }

    canActivate(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            const usecasesArray = decodedToken.UseCases;
            if (usecasesArray.includes(9)) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        } else {
            // User is not logged in, redirect to the login page
            this.router.navigate(['/login']);
            return false;
        }
    }
}
