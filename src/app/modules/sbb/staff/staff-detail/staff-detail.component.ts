import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ShopService } from 'src/app/services/shop.service';
import { EditStaffProfileComponent } from '../edit-staff-profile/edit-staff-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { EditStaffPasswordComponent } from '../edit-staff-password/edit-staff-password.component';
import { EditStaffPermissionComponent } from '../edit-staff-permission/edit-staff-permission.component';
import { EditStaffMoneyAccountComponent } from '../edit-staff-money-account/edit-staff-money-account.component';
import { StaffService } from 'src/app/services/staff.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
})

export class StaffDetailComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  id!: any;
  staffDetail: any = {
    name: "Thu Hương",
    email: "huong@gmail.com",
    phoneNumber: "090912345678",
    statusChips: [
      { id: "1", color: "primary", name: "hoạt động" }
    ],
    dob: new Date,
    gender: "nữ",
    permissionChips: [
      { id: "1", color: "none", name: "Xử lý hàng" },
      { id: "2", color: "none", name: "kho" }
    ],
    moneyAccountChips: [
      { id: "1", color: "none", name: "Tiền mặt" },
      { id: "2", color: "none", name: "Ngân hàng" }
    ]
  };

  constructor(
    private dialog: MatDialog,
    private mappingModels: MappingModels,
    private staffService: StaffService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.getStaff();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'];
  }

  getStaff() {
    this.staffService.getStaff(this.id)
      .subscribe(res => {
        this.staffDetail = this.mappingModels.MappingStaff(res);
        this.staffDetail.moneyAccountChips = this.staffDetail.staffMoneyAccounts.map((c: any) => { return { name: c.moneyAccountName, id: c.moneyAccountId } });
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  editStaffProfile() {
    const dialogRef = this.dialog.open(EditStaffProfileComponent, {
      data: this.staffDetail,
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getStaff();
      }, environment.loadTimeout);
    });
  }

  editStaffPassword() {
    const dialogRef = this.dialog.open(EditStaffPasswordComponent, {
      data: this.staffDetail,
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
      }, environment.loadTimeout);
    });
  }

  editStaffPermission() {
    const dialogRef = this.dialog.open(EditStaffPermissionComponent, {
      data: this.staffDetail,
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getStaff();
      }, environment.loadTimeout);
    });
  }

  editStaffMoneyAccount() {
    const dialogRef = this.dialog.open(EditStaffMoneyAccountComponent, {
      data: this.staffDetail,
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getStaff();
      }, environment.loadTimeout);
    });
  }


}