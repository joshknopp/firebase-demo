import { Injectable } from '@angular/core';
import { getAuth, signOut } from 'firebase/auth';
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
    signOut(getAuth());
    this.loginPayload = undefined;
    this.loginStatusSubject.next(false);
    this.removeUserFromStorage();
  }

  private retrieveUserFromStorage() {
    const storedUser = localStorage.getItem(this.storageKey);
    if (storedUser) {
      this.loginPayload = JSON.parse(storedUser);
      this.loginStatusSubject.next(true);
    }
  }

  private saveUserToStorage() {
    if (this.loginPayload) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.loginPayload));
    }
  }

  private removeUserFromStorage() {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loginStatus$;
  }

  getAuthPayload(): any {
    return this.loginPayload;
  }
}
