import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { first, Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  name!: string;
  isAuthenticated!: boolean;
  isAdmin!: boolean;
  subscription!: Subscription;
  userId!: string;
  staffId!: number | null;
  isChatAdmin = false;

  @Output() sidenavClose = new EventEmitter();

  constructor(
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,
  ) {

  };

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated;

    if (this.isAuthenticated) {
      this.name = this.authService.username;
    }

    if (environment.firebase.adminUsers.find((u: any) => { return u.name === this.name })) {
      this.isChatAdmin = true;
    }
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  async signout() {
    await this.authService.signout();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}
