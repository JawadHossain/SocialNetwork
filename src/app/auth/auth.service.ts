import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' }) // Injected in signup and login component
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {});
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          // set timer for token expiration
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          // create expiration date
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * Try to login user with data from Local Storage
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    // Check if token expiry
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    // check if date in future
    if (expiresIn > 0) {
      this.setAuthTimer(expiresIn / 1000); // covert to s
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  /**
   * Handle User logout
   */
  logout() {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Save Auth Data to Local Storage
   */
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  /**
   * Remove Auth Data from Local Storage
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  /**
   * Get data from Local Storage
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  /**
   * Setup Toke Expiration Timeout
   */
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000); // convert to ms
  }
}
