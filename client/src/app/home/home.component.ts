import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RemoteService } from '../remote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  authPayload: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private remoteService: RemoteService
  ) { }

  ngOnInit(): void {
    this.authPayload = this.authService.getAuthPayload();
  }

  async test() {
    console.log(`makePrivateApiRequest result: `, await this.remoteService.makePrivateApiRequest());
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/sign-in']);  // TODO Should nav actions like this be in response to an observable, governed elsewhere?
  }


}
