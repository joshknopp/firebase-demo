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
          console.warn(`403 error ${error.error?.error?.code}`, error);
        }
        // Re-throw the error to be caught by the subscriber
        return throwError(() => error);
      })
    );
  }
}

// Recently expired
/*
{
    "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
    },
    "status": 403,
    "statusText": "OK",
    "url": "https://xyz1234567.execute-api.us-east-1.amazonaws.com/secure",
    "ok": false,
    "name": "HttpErrorResponse",
    "message": "Http failure response for https://xyz1234567.execute-api.us-east-1.amazonaws.com/secure: 403 OK",
    "error": {
        "error": {
            "code": "auth/id-token-expired",
            "message": "Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."
        },
        "token": "eyJhbG..."
    }
}
*/

// Long expired
/*
{
  "headers": {
      "normalizedNames": {},
      "lazyUpdate": null
  },
  "status": 403,
  "statusText": "OK",
  "url": "https://xyz1234567.execute-api.us-east-1.amazonaws.com/secure",
  "ok": false,
  "name": "HttpErrorResponse",
  "message": "Http failure response for https://xyz1234567.execute-api.us-east-1.amazonaws.com/secure: 403 OK",
  "error": {
      "error": {
          "code": "auth/argument-error",
          "message": "Firebase ID token has \"kid\" claim which does not correspond to a known public key. Most likely the ID token is expired, so get a fresh token from your client app and try again."
      },
      "token": "eyJhbG..."
  }
}
*/