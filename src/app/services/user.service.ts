import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ConfigService } from '../shared/config.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const ssoUrl = `${environment.ssoUrl}/api/account`;
const apiUrl = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient,
    private configService: ConfigService) {
    super();
  }

  refreshToken(refreshTokenForm: any) {
    console.log(refreshTokenForm);

    return this.http.post<any>(`${this.configService.authApiURI}/account/refresh`, refreshTokenForm).pipe(
      tap((dto: any) => console.log(`Success: ${JSON.stringify(dto)}`)),
      catchError(this.handleError)
    );
  }

  login(loginForm: any) {
    return this.http.post<any>(`${this.configService.authApiURI}/account/login`, loginForm).pipe(
      tap((dto: any) => console.log(`Success: ${JSON.stringify(dto)}`)),
      catchError(this.handleError)
    );
  }

  logout(refreshTokenForm: any) {
    return this.http.post<any>(`${this.configService.authApiURI}/account/logout`, refreshTokenForm).pipe(
      tap((dto: any) => console.log(`Success: ${JSON.stringify(dto)}`)),
      catchError(this.handleError)
    );
  }

  changePassword(changePasswordForm: any) {
    return this.http.put<any>(`${this.configService.authApiURI}/account/changePassword`, changePasswordForm).pipe(
      tap((dto: any) => console.log(`Success: ${JSON.stringify(dto)}`)),
      catchError(this.handleError)
    );
  }

  ping(): Observable<any> {
    return this.http.get<any>(`${this.configService.authApiURI}/account/ping`,
      {
        headers: { ignoreLoadingBar: '' },
      })
      .pipe(
        tap(() => console.log(`ping ok`)),
        catchError(this.handleError)
      );
  }

  getAccount(id: any): Observable<any> {
    const url = `${ssoUrl}/${id}`;

    return this.http.get<any>(url)
      .pipe(
        tap((account: any) => console.log(`Account: ${JSON.stringify(account)}`)),
        catchError(this.handleError)
      );
  }

  getAccountSync(id: any): Promise<any> {
    if (!id || id === '') {
      return Promise.reject("id not found");
    }

    return this.getAccount(id).toPromise();
  }

  updateProfilePhoto(formData: any, options: any) {
    return this.http.post<any>(`${ssoUrl}/profile/profilePhoto`, formData, options).pipe(
      tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
      catchError(this.handleError)
    );
  }

  updateCoverPhoto(formData: any, options: any) {
    return this.http.post<any>(`${apiUrl}/business/coverPhoto`, formData, options).pipe(
      tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
      catchError(this.handleError)
    );
  }
}