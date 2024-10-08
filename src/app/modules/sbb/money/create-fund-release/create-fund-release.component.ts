import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountantService } from 'src/app/services/accountant.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ConfigService } from 'src/app/shared/config.service';
import { DateService } from 'src/app/shared/date.service';

@Component({
  selector: 'app-create-fund-release',
  templateUrl: './create-fund-release.component.html',
})

export class CreateFundReleaseComponent implements OnInit {
  form!: FormGroup;
  currentUserSubscription!: Subscription;
  current!: any;
  moneyAccounts: any[] = [];
  account: any;
  textMoney: any = '';

  constructor(
    private fb: FormBuilder,
    private dateService: DateService,
    private configService: ConfigService,
    private alertService: AlertService,
    private authService: AuthService,
    private accountantService: AccountantService,
    public dialogRef: MatDialogRef<CreateFundReleaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.account = this.authService.getAccount();

    this.form = this.fb.group({
      description: [null, Validators.required],
      totalMoney: [null, Validators.required],
      moneyAccountId: [null, Validators.required],
    });

    this.form.get("totalMoney")?.valueChanges.subscribe(value => {
      this.textMoney = this.configService.getCurrencyInVietnamWord(this.configService.getCurrencyValue(value));
    });

    this.data = this.data;
    this.getMoneyAccounts();
  }

  updateMoneyDisplay(event: any){
    let displayValue = this.configService.getCurrencyDisplay(event.target.value);
    this.form.get("totalMoney")?.setValue(displayValue);
  }

  okClick(): void {
    let date = this.dateService.getDateNow();
    let data = {
      FundTypeId: 4,
      title: `Phiếu xuất quỹ ngày ${date} bởi ${this.account?.username}`,
      moneyAccountId: this.form.get("moneyAccountId")?.value,
      totalMoney: this.configService.getCurrencyValue(this.form.get("totalMoney")?.value),
      description: this.form.get("description")?.value
    };

    this.accountantService.createMoneyImportExport(data)
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

}