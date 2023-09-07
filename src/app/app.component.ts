import { Component, Inject,PLATFORM_ID } from '@angular/core';
import {APP_BASE_HREF, isPlatformBrowser} from "@angular/common";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CarRentalProjekat';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  loggedIn(){
    const token = localStorage.getItem('token');

    if(token){
      return true;
    }else{
      return false;
    }
  }

  logout(): void {
    // Remove the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Redirect to the login page or any other desired page
    this.router.navigate(['/login']);
  }

  isAdminRoute(): boolean {
    // Traverse the route tree to check if any parent route is 'admin'
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.routeConfig?.path === 'admin') {
        return true;
      }
    }
    return false;
  }


}
