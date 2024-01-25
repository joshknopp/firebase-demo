import { Component, OnInit } from '@angular/core';

import { EmailAuthProvider, FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider, getAuth } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

// TODO Move some of this to service and change flow? Want to also ensure getAuth is singleton - it SHOULD be already...
const firebaseConfig = environment.firebaseConfig;

const app = initializeApp(firebaseConfig);

const ui = new firebaseui.auth.AuthUI(getAuth());

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const authService: AuthService = this.authService;
    const router: Router = this.router;
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult: any, redirectUrl: string) {
          console.log(`signInSuccessWithAuthResult`, authResult, redirectUrl);
          authService.signIn(authResult).then(() => {
            console.log(`done signIn`)
            router.navigate(['home']);
          });
          return false;
        },
        uiShown: function() {
          console.log(`Sign in widget is ready`);
        }
      },
      signInSuccessUrl: '/home',
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        //EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        GoogleAuthProvider.PROVIDER_ID,
        FacebookAuthProvider.PROVIDER_ID,
        //TwitterAuthProvider.PROVIDER_ID
      ],
      // tosUrl: '<your-tos-url>',
      // privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    ui.start('#firebaseui-auth-container', uiConfig);
  }
}
