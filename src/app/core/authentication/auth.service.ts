import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, first, tap } from 'rxjs/operators';
import { UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseService {

  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  //private manager = new UserManager(getClientSettings());
  private account: any = {}; //User | null; // account as user identity oidc
  private accountLocalStoreKey: string = 'accountLocal';
  private firebaseAccountLocalStoreKey: string = 'firebaseAccountLocal';
  permissions: any[] = [];
  groupPermissions: any[] = [];

  constructor(private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
    private alertService: AlertService,
    private firebaseService: FirebaseService,
    private navigationService: NavigationService,
    private userService: UserService) {
    super();
    this._authNavStatusSource.next(this.doAuthenticated());
  }

  initialize() {
    console.log("initialize auth service");
    this.permissions = this.getPermissions;
    this.groupPermissions = this.configService.getAllGroupPermissions(this.permissions);
  }

  register(userRegistration: any) {
    let url = `${this.configService.authApiURI}/account/register`;
    return this.http.post<any>(url, userRegistration).pipe(
      tap((dto: any) => console.log(`Registerd: ${JSON.stringify(dto)}`)),
      catchError(this.handleError));
  }

  login(loginForm: any, redirect: any) {
    this.userService.login(loginForm)
      .subscribe({
        next: async data => {
          this.account = data;
          this.account['username'] = loginForm.UserName;
          this.setAccount(this.account);

          // auto login firebase
          let email = loginForm.UserName + environment.firebase.defaultSuffixEmail;
          await this.loginFirebaseThenRedirect(email, environment.firebase.defaultPassword, loginForm.UserName);
          this.router.navigateByUrl(redirect).then(() => { window.location.reload() });
        },
        error: err => {
          this.alertService.showToastError();
        },
        complete: () => {
          this.alertService.showToastSuccess();
        }
      });
  }

  async loginFirebaseThenRedirect(email: string, password: string, name: string, phone: string = '') {
    await this.firebaseService.createIfNotExistThenLoginFirebase(email, password, name, phone);
  };

  signout() {
    let account = this.getAccount();
    console.log("account", account);

    let refreshTokenForm = {
      refreshToken: account?.refreshToken
    };

    console.log("refreshTokenForm", refreshTokenForm);
    this.userService.logout(refreshTokenForm).pipe(first())
      .subscribe({
        next: async c => {
          await this.firebaseService.logout();
          this.navigationService.setHistoryLocal([]);
          this.removeAccountThenRedirectLogin();

          this.alertService.showToastSuccess();
        },
        error: error => {
          this.navigationService.setHistoryLocal([]);
          this.removeAccountThenRedirectLogin();
        },
        complete: () => {
          this.navigationService.setHistoryLocal([]);
          this.removeAccountThenRedirectLogin();
        }
      });
  }

  private removeAccountThenRedirectLogin() {
    this.removeAccount();
    this.router.navigateByUrl('/login');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  doAuthenticated(): boolean {
    let account = this.getAccount();
    let isAuthen = account ?? false;

    if (!isAuthen) return false;

    let current = Math.floor(Date.now() / 1000);
    let expiredInSecond = ~~account.loginTime + ~~account.expiresIn - current;

    console.log("expiredInSecond", expiredInSecond);

    if (expiredInSecond < 0) {
      this.removeAccount();
    }

    return isAuthen;
  }

  completeAuthentication() { }

  public isUserAdmin = (): boolean => {
    let roles = this.account?.profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return Array.isArray(roles) ? roles.includes('admin') : roles == 'admin';
  }

  get isAuthenticated(): boolean {
    let account = this.getAccount();
    return account && account !== '';
  }

  get username(): string {
    let account = this.getAccount();
    return account?.username;
  }

  get getPermissions(): any[] {
    let account = this.getAccount();

    // if (account == null || !account.permissions || account.permissions.length == 0) {
    //   //this.router.navigate(['/login']).then(() => window.location.reload());
    //   throw new Error("Invalid permission!");
    // }

    return account?.permissions;
  }

  get authorizationHeaderValue(): string {
    let account = this.getAccount();
    return `${account?.tokenType} ${account?.accessToken}`;
  }

  get refreshAuthorizationHeaderValue(): string {
    let account = this.getAccount();
    return `${account?.tokenType} ${account?.refreshToken}`;
  }

  getAccount() {
    try {
      let json = localStorage.getItem(this.accountLocalStoreKey) ?? "";

      if (!json || json === "") {
        return null;
      }

      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  setAccount(account: any) {
    // renew
    this.removeAccount();

    // set login time
    let current = Math.floor(Date.now() / 1000);
    this.account.loginTime = current;

    this.account.permissions = this.configService.getAllPermissions();

    localStorage.setItem(this.accountLocalStoreKey, JSON.stringify(account));

    console.log("set account local", this.account);
  }

  removeAccount() {
    console.log("remove accountLocalStoreKey");
    localStorage.removeItem(this.accountLocalStoreKey);
    localStorage.removeItem(this.firebaseAccountLocalStoreKey);
  }


  hasGroupPermission(groupPermissions: any[]) {
    if (!groupPermissions || groupPermissions.length == 0) return false;

    return this.groupPermissions.some((c: any) => groupPermissions.includes(c))
  }

  hasPermission(permissions: any[]) {
    if (!permissions || permissions.length == 0) return false;

    return this.permissions.some((c: any) => permissions.includes(c))
  }

}

// a client app setting
export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.ssoUrl,
    client_id: 'houzz-web-app',
    redirect_uri: `${environment.appUrl}/authentication/callback`,
    post_logout_redirect_uri: environment.appUrl,
    response_type: "id_token token",
    scope: "email openid",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: false,
    silent_redirect_uri: `${environment.appUrl}/silent-refresh.html`
  };
}

export interface Account extends User {
  userName: string,
}