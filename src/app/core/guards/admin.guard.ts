import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO: if (this.authService.getAccount()) {
    if(this.authService.isUserAdmin())
      return true;
      
    this.router.navigate(['/authentication/forbidden'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}