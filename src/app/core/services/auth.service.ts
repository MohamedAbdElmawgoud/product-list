import { Injectable } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environments';
import {
  loginRequest,
  loginResponse,
} from '../../shared/models/login.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(body: loginRequest): Observable<loginResponse> {
    return this.http.post<loginResponse>(env.baseUrl + '/auth/login', body);
  }

  logout() {
    this.storageService.removeItem('token');
    this.router.navigate(['/auth/sign-in']);
  }

  isSignedIn() {
    return this.storageService.getItem('token') || 'false';
  }
}
