import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();
  
  private storageKey = 'authUser';

  loginPayload?: any;

  constructor() {
    this.retrieveUserFromStorage();
    this.loginStatus$.subscribe();
  }

  signIn(loginPayload: any) {
    this.loginPayload = loginPayload;
    this.loginStatusSubject.next(true);
    this.saveUserToStorage();
  }

  signOut() {
    this.loginPayload = undefined;
    this.loginStatusSubject.next(false);
    this.removeUserFromStorage();
  }

  // Retrieve user from storage
  private retrieveUserFromStorage() {
    const storedUser = localStorage.getItem(this.storageKey);
    if (storedUser) {
      this.loginPayload = JSON.parse(storedUser);
      this.loginStatusSubject.next(true);
    }
  }

  // Save user to storage
  private saveUserToStorage() {
    if (this.loginPayload) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.loginPayload));
    }
  }

  // Remove user from storage
  private removeUserFromStorage() {
    localStorage.removeItem(this.storageKey);
  }

  // TODO solve for cross-session persistence
  isLoggedIn$(): Observable<boolean> {
    return this.loginStatus$;
  }
}
