import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  authPayload: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authPayload = this.authService.getAuthPayload();
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/sign-in']);  // TODO Should nav actions like this be in response to an observable, governed elsewhere?
  }


}
