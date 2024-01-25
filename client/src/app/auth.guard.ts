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
            console.log({isLoggedIn})
            return true;
          } else {
            // TODO should not make this decision here, maybe just redirect to root?
            console.log({isLoggedIn})
            this.router.navigate(['/sign-in']);
            return false;
          }
        })
      );

  }
  
}
