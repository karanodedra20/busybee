import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  loading = signal(false);

  async onEmailSignup(): Promise<void> {
    // Validation
    if (!this.email() || !this.password() || !this.confirmPassword()) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.toastService.error('Passwords do not match');
      return;
    }

    if (this.password().length < 6) {
      this.toastService.error('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    try {
      await this.authService.signUpWithEmail(this.email(), this.password());
      this.loading.set(false);
      this.toastService.success('Account created successfully!');
      this.router.navigate(['/tasks']);
    } catch (error) {
      this.loading.set(false);
      // Error already handled by auth service
    }
  }

  async onGoogleSignup(): Promise<void> {
    this.loading.set(true);
    try {
      await this.authService.signInWithGoogle();
      this.loading.set(false);
      this.toastService.success('Successfully signed up with Google!');
      this.router.navigate(['/tasks']);
    } catch (error) {
      this.loading.set(false);
      // Error already handled by auth service
    }
  }
}
