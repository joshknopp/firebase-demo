import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { RemoteService } from '../remote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  serverResponse: any = 'Waiting for first request';

  constructor(
    public authService: AuthService,
    private remoteService: RemoteService
  ) { }

  async tryPing() {
    this.serverResponse = await this.remoteService.fetchHealthStatus();
  }

  async trySecureRequest() {
    this.serverResponse = await this.remoteService.makeSecureApiRequest();
  }

  async signOut() {
    await this.authService.signOut();
  }
}
