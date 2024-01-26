import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  async ping() {
    try {
      const response = await firstValueFrom(this.http.get<string>(`${environment.apiUrl}/health`));
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send message to the API');
    }
  }

  async makePrivateApiRequest(): Promise<void> {
    const token: string | undefined = await this.authService.getFirebaseToken();
    const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/secure`));
    console.log('Private API Response:', response);
  }
}
