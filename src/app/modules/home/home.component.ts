import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit {
  name!: string;
  isAuthenticated!: boolean;
  isAdmin!: boolean;
  subscription!: Subscription;

  // page
  length = 50;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  pageEvent!: PageEvent;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  form!: FormGroup;
  
  constructor(private router: Router,
    private fb: FormBuilder,
    private authService: AuthService) {
  }

  ngAfterViewInit() {
    if (this.isAuthenticated) {
      if (this.isAdmin) {
        // fetch data
      } else {
        this.router.navigate([`/home`]);
      }
    }
  }

  ngOnInit(): void {
  
  }
}