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
      const response = await firstValueFrom(this.http.get<string>(`${environment.apiUrl}/hello/ping`));
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send message to the API');
    }
  }

  async makePrivateApiRequest(): Promise<void> {
    try {
      const token = await this.authService.getFirebaseToken();
      if(!token) throw new Error(`No auth token`);
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      console.log(token);
      const response = await firstValueFrom(this.http.get<string>(`${environment.apiUrl}/secure`, { headers, withCredentials: true }));
      
      // Handle the response as needed
      console.log('Private API Response:', response);
    } catch (error) {
      // Handle errors, e.g., unauthorized access
      console.error('Error making private API request:', error);
    }
  }
}
