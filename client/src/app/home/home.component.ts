import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { RemoteService } from '../remote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    public authService: AuthService,
    private remoteService: RemoteService
  ) { }

  async tryPing() {
    console.log(`tryPing result: `, await this.remoteService.fetchHealthStatus());
  }

  async trySecureRequest() {
    console.log(`makeSecureApiRequest result: `, await this.remoteService.makeSecureApiRequest());
  }

  async signOut() {
    await this.authService.signOut();
  }
}
