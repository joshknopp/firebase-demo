import { Injectable } from '@angular/core';
import { User, browserLocalPersistence, getAuth, setPersistence, signOut } from 'firebase/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<User | null | undefined> = new BehaviorSubject<User | null | undefined>(undefined);

  constructor() {
    setPersistence(getAuth(), browserLocalPersistence);

    getAuth().onAuthStateChanged((state) => {
      this.user$.next(state);
    });
  }

  isLoggedIn$(): Observable<boolean | undefined> {
    return this.user$.pipe(
      map(user => user === undefined ? undefined : user !== null)
    );
  }

  async getFirebaseToken(): Promise<string | undefined> {
    return await getAuth().currentUser?.getIdToken();
  }

  async signOut() {
    await signOut(getAuth());
  }
}
