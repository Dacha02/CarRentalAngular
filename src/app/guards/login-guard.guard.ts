import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(private router: Router) {
  }
  canActivate(): boolean {
    // Check if the user is logged in by verifying the presence of a token
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, redirect to another page (e.g., home page)
      this.router.navigate(['/home']);
      return false; // Prevent access to the login page
    }

    // User is not logged in, allow access to the login page
    return true;
  }
  
}
