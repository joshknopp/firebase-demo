import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {

  constructor(private http: HttpClient) {}

  async fetchHealthStatus(): Promise<string> {
    return await firstValueFrom(this.http.get<string>(`${environment.apiUrl}/health`));
  }

  async makeSecureApiRequest(): Promise<Object> {
    return await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/secure`));
  }
}
