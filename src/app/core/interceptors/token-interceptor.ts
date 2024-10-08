import { Injectable } from '@angular/core';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Injectable({
    providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService,
        private userService: UserService,
        private router: Router,
    ) {
        // ping to refresh token
        setInterval(() => {
            let account = this.authService.getAccount();
            if (account != null) {
                this.userService.ping().subscribe(() => {
                });
            }
        }, 300000);
    }
    
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        // add token
        const token = this.authService.authorizationHeaderValue;
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token,
                },
            });
        }

        // check 401 to refresh token
        return next.handle(request).pipe(
            tap((res: any) => { }),
            catchError((err) => {
                console.log("err", err);

                if (err.status === 401) {
                    console.log(err);
                    this.refreshToken();
                }

                //this.authService.signout();
                const error = err?.error?.message || err?.statusText;
                return throwError(error);
            })
        );
    }


    refreshToken() {
        let account = this.authService.getAccount();

        if (account && account.refreshToken) {

            let refreshTokenForm = {
                refreshToken: account?.refreshToken
            };

            this.userService.refreshToken(refreshTokenForm).subscribe((res: any) => {
                console.log("refreshToken", res);
                if (res) {
                    let newAccount: any = res;
                    newAccount.username = account.username;
                    this.authService.setAccount(newAccount);
                } else {
                    this.authService.signout();
                }
            }, err => {
                this.authService.signout();
            });

        } else {
            this.authService.signout();
        }
    }
}