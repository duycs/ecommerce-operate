import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountantService } from 'src/app/services/accountant.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { DatePipe } from '@angular/common';
import { ConfigService } from 'src/app/shared/config.service';
import { DateService } from 'src/app/shared/date.service';

@Component({
  selector: 'app-create-money-collect',
  templateUrl: './create-money-pay.component.html',
})

export class CreateMoneyPayComponent implements OnInit {
  form!: FormGroup;
  currentUserSubscription!: Subscription;
  current!: any;
  account: any;
  moneyAccounts: any[] = [];
  moneyReasons: any[] = [];
  objectTypes: any[] = [
    { id: 1, name: "Khách hàng" },
    { id: 2, name: "Nhà cung cấp" },
    // { id: 3, name: "Nhà vận chuyển" },
    // { id: 4, name: "Nhân viên" },
    // { id: 5, name: "Hệ thống" },
    // { id: 6, name: "Khác" }
  ];
  
  objects: any = [];
  textMoney: any = '';

  constructor(
    private fb: FormBuilder,
    private dateService: DateService,
    private configService: ConfigService,
    private authService: AuthService,
    private alertService: AlertService,
    private accountantService: AccountantService,
    public dialogRef: MatDialogRef<CreateMoneyPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getMoneyAccounts();
    this.getMoneyReasons();
    this.account = this.authService.getAccount();

    this.form = this.fb.group({
      moneyAccountId: [null, Validators.required],
      moneyReasonId: [null, Validators.required],
      objectTypeId: [null, Validators.required],
      objectId: [null, Validators.required],
      totalMoney: [null, Validators.required],
      description: [null, Validators.required],
    });

    this.form.get("totalMoney")?.valueChanges.subscribe(value => {
      this.textMoney = this.configService.getCurrencyInVietnamWord(this.configService.getCurrencyValue(value));
    });

    this.data = this.data;
  }

  updateMoneyDisplay(event: any){
    let displayValue = this.configService.getCurrencyDisplay(event.target.value);
    this.form.get("totalMoney")?.setValue(displayValue);
  }

  okClick(): void {
    let date = this.dateService.getDateNow();
    let data = {
      ledgerTypeId: 2,
      title: `Phiếu chi ngày ${date} bởi ${this.account?.username}`,
      moneyAccountId: this.form.get("moneyAccountId")?.value,
      moneyReasonId: this.form.get("moneyReasonId")?.value,
      objectTypeId: this.form.get("objectTypeId")?.value,
      objectId: this.form.get("objectId")?.value,
      totalMoney: this.configService.getCurrencyValue(this.form.get("totalMoney")?.value),
      description: this.form.get("description")?.value
    };

    this.accountantService.createLedger(data)
      .subscribe(() => {
        this.alertService.showToastSuccess();
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });

    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  getMoneyAccounts() {
    let params: any = {};
    this.accountantService.getMoneyAccounts(params, 0, 10000).subscribe((data) => {
      this.moneyAccounts = data;
    });
  }

  getMoneyReasons() {
    let params: any = {
      ReasonTypeId: 2
    };
    this.accountantService.getMoneyReasons(params, 0, 10000).subscribe((data) => {
      this.moneyReasons = data;
    });
  }

  selectObject() {
    let objectTypeId = this.form.get("objectTypeId")?.value;
    this.accountantService.getObjects(objectTypeId)
      .subscribe((data) => {
        this.objects = data;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

}