import { Injectable } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuardService {
  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    const isSignedIn = this.storageService.getItem('token');
    if (isSignedIn) {
      return true;
    } else {
      this.authService.logout();
      return false;
    }
  }
}
