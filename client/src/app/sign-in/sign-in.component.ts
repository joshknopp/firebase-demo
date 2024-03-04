import { Component, OnInit } from '@angular/core';

import { EmailAuthProvider, FacebookAuthProvider, GoogleAuthProvider, getAuth } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { RemoteService } from '../remote.service';

initializeApp(environment.firebaseConfig);
const ui = new firebaseui.auth.AuthUI(getAuth());

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  serverResponse: any = 'Waiting for first request';

  constructor(private remoteService: RemoteService) {}

  // TODO After June 18, 2024, confirm this still works, else consult https://firebase.google.com/docs/auth/web/redirect-best-practices#self-host-helper-code
  ngOnInit(): void {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult: any, redirectUrl: string): boolean {
          return false;
        },
        signInFailure: function(error: any): void {
          console.error(`signInFailure`, error);
        },
        uiShown: function(): void {
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
  
  async tryPing() {
    this.serverResponse = await this.remoteService.fetchHealthStatus();
  }

  async trySecureRequest() {
    try {
      this.serverResponse = await this.remoteService.makeSecureApiRequest();
    } catch(err: any) {
      this.serverResponse = err;
    }
  }
}
