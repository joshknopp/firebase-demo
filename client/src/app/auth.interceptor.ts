import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getFirebaseToken()).pipe(
      switchMap((token) => {
        if (token) {
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(authReq);
        }
        return next.handle(request);
      }),
      catchError((error) => {
        if (error.status === 403) {
          console.warn(`403 error ${error.error}`, error);
        }
        // Re-throw the error to be caught by the subscriber
        return throwError(() => error);
      })
    );
  }
}
