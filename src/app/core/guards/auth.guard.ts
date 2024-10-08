import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';

import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  ignoreUrls = ["notification/web/mine"];

  constructor(private router: Router,
    private activedRoute: ActivatedRoute,
    private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if (this.authService.getAccount()) {
      return true;
    }

    console.log("have not account, redirect to login");

    this.router.navigate(['/login'], { queryParams: { redirect: state.url }, replaceUrl: true }).then(() => window.location.reload());

    return false;
  }

}