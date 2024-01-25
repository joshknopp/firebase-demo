import { Component, OnInit } from '@angular/core';

import { EmailAuthProvider, FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider, User, UserCredential, getAuth, signInWithPopup } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

  fakeSignIn() {
    this.authService.signIn();
    this.router.navigate(['/']);  // TODO Should nav actions like this be in response to an observable, governed elsewhere?
  }

  ngOnInit(): void {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult: any, redirectUrl: string) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          console.log(`signInSuccessWithAuthResult`, authResult, redirectUrl);
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          console.log(`uiShown Sign in widget is ready`);
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        EmailAuthProvider.PROVIDER_ID,
        //EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        GoogleAuthProvider.PROVIDER_ID,
        FacebookAuthProvider.PROVIDER_ID,
        TwitterAuthProvider.PROVIDER_ID
      ],
      // tosUrl: '<your-tos-url>',
      // privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    ui.start('#firebaseui-auth-container', uiConfig);
  }
}
