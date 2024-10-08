import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
})

export class StaffProfileComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  shopId!: any;
  @Input() staffDetail!: any;

  constructor(
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.shopId = this.activeRoute.snapshot.params['id'];
  }

  editProfile() {

  }

  changePassword() {

  }

}