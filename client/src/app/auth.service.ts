import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  constructor() {
    this.loginStatus$.subscribe();
  }

  signIn() {
    // Perform login logic

    // Notify subscribers about the login status change
    this.loginStatusSubject.next(true);
  }

  signOut() {
    // Perform logout logic

    // Notify subscribers about the login status change
    this.loginStatusSubject.next(false);
  }

  // TODO solve for cross-session persistence
  isLoggedIn$(): Observable<boolean> {
    return this.loginStatus$;
  }
}
