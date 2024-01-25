import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.isLoggedIn$().pipe(
        map((isLoggedIn) => {
          if (isLoggedIn) {
            if(state.url === '/sign-in') {
              this.router.navigate(['/home']);
              return false;
            } else {
              return true;
            }
          } else {  // Logged-out user
            if (state.url !== '/sign-in') {
              this.router.navigate(['/sign-in']);
              return false;
            } else {
              return true;
            }
          }
        })
      );
  }
}
