import { Injectable } from '@angular/core';
import { browserLocalPersistence, getAuth, setPersistence, signOut } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  private storageKey = 'authUser';
  private storageKeyForToken = 'authUserToken';
  private storageKeyForRefreshToken: string = 'authRefreshToken';

  loginPayload?: any;

  constructor() {
    this.retrieveUserFromStorage();
    this.loginStatus$.subscribe();
    setPersistence(getAuth(), browserLocalPersistence);
  }

  async handleSignInSuccess(loginPayload: any) {
    this.loginPayload = loginPayload;
    this.loginStatusSubject.next(true);
    this.saveUserToStorage();
    const firebaseToken: string | undefined = await getAuth().currentUser?.getIdToken();
    const refreshToken: string | undefined = getAuth().currentUser?.refreshToken;
    console.log(`on signIn`, { firebaseToken, refreshToken, loginPayload: this.loginPayload });
    if(firebaseToken) {
      localStorage.setItem(this.storageKeyForToken, firebaseToken);
    }
    if(refreshToken) {
      localStorage.setItem(this.storageKeyForRefreshToken, refreshToken);
    }
  }

  refreshAuth(refreshToken: string) {
    // Do something like getAuth().refresh
    
  }

  signOut() {
    signOut(getAuth());
    this.loginPayload = undefined;
    this.loginStatusSubject.next(false);
    this.removeUserFromStorage();
    localStorage.removeItem(this.storageKeyForToken);
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

  async getLocalFirebaseToken(): Promise<string | undefined> {
    return localStorage.getItem(this.storageKeyForToken) ?? undefined;
  }

  async getLocalRefreshToken(): Promise<string | undefined> {
    return localStorage.getItem(this.storageKeyForRefreshToken) ?? undefined;
  }
}
