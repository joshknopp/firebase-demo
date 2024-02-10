import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$().subscribe(isLoggedIn => {
      const currentUrl: string = this.router.routerState.snapshot.url;
      if (isLoggedIn === false && currentUrl !== '/sign-in') {
        this.router.navigate(['/sign-in']);
      } else if(isLoggedIn && currentUrl === '/sign-in') {
        this.router.navigate(['/home']);
      }
    });
  }

  // TODO Prevent brief flicker of incorrect routes on new session when isLoggedIn === undefined; consider a resolver to force defined boolean
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.isLoggedIn$().pipe(
        map((isLoggedIn) => {
          if (isLoggedIn && state.url === '/sign-in') {
            this.router.navigate(['/home']);
            return false;
          } else if (isLoggedIn === false && state.url !== '/sign-in') {
            this.router.navigate(['/sign-in']);
            return false;
          }
          return true;
        })
      );
  }
}
