// auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.authService.getFirebaseToken()).pipe(
      switchMap((token) => {
        if (token) {
          // Clone the request and add the Bearer token to the headers
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Pass the cloned request to the next handler
          return next.handle(authReq);
        }

        // If no token, proceed with the original request
        return next.handle(request);
      })
    );
  }
}
