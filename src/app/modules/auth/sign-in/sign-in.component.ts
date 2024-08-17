import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { loginResponse } from '../../../shared/models/login.interface';
import { StorageService } from '../../../shared/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  signInForm: FormGroup = new FormGroup({});
  errorMessages: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.signInForm.valid) {
      this.authService.login(this.signInForm.value).subscribe(
        (res: loginResponse) => {
          // Handle success: Save token or redirect
          this.storageService.setItem('token', res.token);
          this.router.navigate(['products']);
        },
        (error) => {
          // Handle server-side error
          this.errorMessages = error.error.message;
          console.error('Login error:', error);
        }
      );
    } else {
      // Mark all controls as touched to trigger validation messages
      this.signInForm.markAllAsTouched();

      // Optionally, display a user-friendly error message
      console.log('Form is invalid');
    }
  }
}
