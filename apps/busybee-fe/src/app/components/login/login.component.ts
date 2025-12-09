import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  email = signal('');
  password = signal('');
  loading = signal(false);

  async onEmailLogin(): Promise<void> {
    if (!this.email() || !this.password()) {
      this.toastService.error('Please enter email and password');
      return;
    }

    this.loading.set(true);
    try {
      await this.authService.signInWithEmail(this.email(), this.password());
      this.loading.set(false);
      this.toastService.success('Successfully signed in!');
      this.router.navigate(['/tasks']);
    } catch (error) {
      this.loading.set(false);
      // Error already handled by auth service
    }
  }

  async onGoogleLogin(): Promise<void> {
    this.loading.set(true);
    try {
      await this.authService.signInWithGoogle();
      this.loading.set(false);
      this.toastService.success('Successfully signed in with Google!');
      this.router.navigate(['/tasks']);
    } catch (error) {
      this.loading.set(false);
      // Error already handled by auth service
    }
  }
}
