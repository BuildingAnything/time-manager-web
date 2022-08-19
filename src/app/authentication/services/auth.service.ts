import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, tap } from 'rxjs';
import { LoginRequest } from 'src/app/shared/models/login-request';
import { User } from 'src/app/shared/models/user';

@Injectable()
export class AuthService {
  constructor(
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router: Router
  ) {}

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');

    return !this.jwtHelper.isTokenExpired(token?.toString());
  }

  public login(loginRequest: LoginRequest): Observable<User> {
    return this.http.post<User>('api/auth', loginRequest).pipe(
      tap((data: User) => {
        localStorage.setItem('token', data.token);

        return data;
      }),
      catchError((e: any) => {
        throw new Error('Erro no login');
      })
    );
  }

  public logout(): any {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
