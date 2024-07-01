import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string = '';
  private tokenTimer!: number;
  private authStatusListener = new Subject<boolean>();
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
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(
      (response) => {
        console.log('User created', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn
          // console.log('expiresInDuration', expiresInDuration);
          this.tokenTimer = window.setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }
  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']).then(() => {
      console.log('Navigated to home');
    }).catch(error => {
      console.error('Navigation error:', error);
    });

  }
}
