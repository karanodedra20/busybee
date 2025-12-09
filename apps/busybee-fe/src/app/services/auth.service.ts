import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
  AuthError,
} from '@angular/fire/auth';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private toastService = inject(ToastService);

  // Current user signal
  currentUser = signal<User | null>(null);

  // Loading state signal
  loading = signal(false);

  // Observable of auth state
  user$ = user(this.auth);

  constructor() {
    // Subscribe to auth state changes
    this.user$.subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<UserCredential> {
    this.loading.set(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.loading.set(false);
      return result;
    } catch (error) {
      this.loading.set(false);
      this.handleAuthError(error as AuthError, 'Google sign-in failed');
      throw error;
    }
  }

  // Sign in with email and password
  async signInWithEmail(
    email: string,
    password: string
  ): Promise<UserCredential> {
    this.loading.set(true);
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.loading.set(false);
      return result;
    } catch (error) {
      this.loading.set(false);
      this.handleAuthError(error as AuthError, 'Sign in failed');
      throw error;
    }
  }

  // Sign up with email and password
  async signUpWithEmail(
    email: string,
    password: string
  ): Promise<UserCredential> {
    this.loading.set(true);
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.loading.set(false);
      return result;
    } catch (error) {
      this.loading.set(false);
      this.handleAuthError(error as AuthError, 'Sign up failed');
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    this.loading.set(true);
    try {
      await signOut(this.auth);
      this.loading.set(false);
    } catch (error) {
      this.loading.set(false);
      this.handleAuthError(error as AuthError, 'Sign out failed');
      throw error;
    }
  }

  // Get ID token for backend authentication
  async getIdToken(): Promise<string | null> {
    const user = this.currentUser();
    if (!user) return null;
    return user.getIdToken();
  }

  // Handle authentication errors
  private handleAuthError(error: AuthError, defaultMessage: string): void {
    let message = defaultMessage;

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password';
        break;
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed';
        break;
      case 'auth/cancelled-popup-request':
        // Don't show error for cancelled popup
        return;
      default:
        message = `${defaultMessage}: ${error.message}`;
    }

    this.toastService.error(message);
  }
}
