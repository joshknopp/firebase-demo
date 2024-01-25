import { Injectable } from '@angular/core';
import { User, getAuth, signOut } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  private storageKey = 'authUser';
  private storageKeyForToken = 'authUserToken';

  loginPayload?: any;

  private firebaseToken?: string;

  constructor() {
    this.retrieveUserFromStorage();
    this.loginStatus$.subscribe();
  }

  async signIn(loginPayload: any) {
    this.loginPayload = loginPayload;
    this.loginStatusSubject.next(true);
    this.saveUserToStorage();
    this.firebaseToken = await getAuth().currentUser?.getIdToken();
    console.log(`on signIn`, this.firebaseToken, this.loginPayload);
    if(this.firebaseToken) {
      localStorage.setItem(this.storageKeyForToken, this.firebaseToken);
    }
  }

  signOut() {
    signOut(getAuth());
    this.loginPayload = undefined;
    this.loginStatusSubject.next(false);
    this.removeUserFromStorage();
    this.firebaseToken = undefined;
    localStorage.removeItem(this.storageKeyForToken);
  }

  private retrieveUserFromStorage() {
    const storedUser = localStorage.getItem(this.storageKey);
    if (storedUser) {
      this.loginPayload = JSON.parse(storedUser);
      this.loginStatusSubject.next(true);
      this.firebaseToken = localStorage.getItem(this.storageKeyForToken) ?? undefined;
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

  async getFirebaseToken(): Promise<string | undefined> {
    return this.firebaseToken;
  }
}
