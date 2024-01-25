import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private authService: AuthService, private router: Router) { }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/sign-in']);  // TODO Should nav actions like this be in response to an observable, governed elsewhere?
  }


}
