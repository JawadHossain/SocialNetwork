import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/user`;

@Injectable({ providedIn: 'root' }) // Injected in signup and login component
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private token: string;

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

  getUserId() {
    return this.userId;
  }

  /**
   * Handle user signup
   */
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(`${BACKEND_URL}/signup`, authData).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${BACKEND_URL}/login`,
        authData
      )
      .subscribe(
        (response) => {
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
            this.userId = response.userId;
            this.saveAuthData(token, expirationDate, this.userId);

            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
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
      this.userId = authInformation.userId;
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
    this.userId = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Save Auth Data to Local Storage
   */
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  /**
   * Remove Auth Data from Local Storage
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  /**
   * Get data from Local Storage
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
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
