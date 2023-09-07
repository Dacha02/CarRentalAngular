import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {TokenRefreshService} from "../shared/services/service/token-refresh.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
      private tokenService: TokenRefreshService,
      private router: Router,
      private jwtHelper: JwtHelperService
  ) {}

  async canActivate(): Promise<boolean> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      //console.log(this.jwtHelper.decodeToken(token));
      return true;
    }

    //let isRefreshSuccess: any= '';
    if(refreshToken){
        await this.tryRefreshingTokens(token, refreshToken);
    }

    // if (isRefreshSuccess) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('refreshToken'); // Implement a logout function in your authentication service
    //   this.router.navigate(['login']);
    //   return false;
    // }

    return true;
  }

  private async tryRefreshingTokens(token: string | null, refreshToken: string | null): Promise<boolean> {

    if (!token || !refreshToken) {
      return false;
    }

    const credentials = { token: token, refresh: refreshToken };
    let isRefreshSuccess: boolean;

    try {
      this.tokenService.create(credentials, undefined).subscribe({
        next: (data: any) => {
          //console.log(data)
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refresh);
        },
        error: (err: any) => {
          //console.log(err);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken'); // Implement a logout function in your authentication service
          this.router.navigate(['login']);
        },
      });
      isRefreshSuccess = true;
    } catch (error) {
      isRefreshSuccess = false;
    }

    return isRefreshSuccess;

  }
}
