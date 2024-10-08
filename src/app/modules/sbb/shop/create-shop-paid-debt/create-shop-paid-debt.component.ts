import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AccountantService } from 'src/app/services/accountant.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Timestamp } from '@angular/fire/firestore';
import { DateService } from 'src/app/shared/date.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
  selector: 'app-create-shop-debt',
  templateUrl: './create-shop-paid-debt.component.html',
})

export class CreateShopPaidDebtComponent implements OnInit {
  form!: FormGroup;
  current!: any;
  account: any;
  moneyAccounts: any = [];
  textMoney: string = '';

  constructor(
    private fb: FormBuilder,
    private dateService: DateService,
    private accountantService: AccountantService,
    private alertService: AlertService,
    private authService: AuthService,
    private configService: ConfigService,
    public dialogRef: MatDialogRef<CreateShopPaidDebtComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      totalMoney: [null, Validators.required],
      moneyAccountId: [null, Validators.required],
      description: [null],
    });
    this.current = new Date();
    this.data = this.data;
    this.account = this.authService.getAccount();
    this.getMoneyAccounts();

    this.form.get("totalMoney")?.valueChanges.subscribe(value => {
      this.textMoney = this.configService.getCurrencyInVietnamWord(this.configService.getCurrencyValue(value));
    });
  }

  updateMoneyDisplay(event: any){
    let displayValue = this.configService.getCurrencyDisplay(event.target.value);
    this.form.get("totalMoney")?.setValue(displayValue);
  }

  getMoneyAccounts() {
    let params: any = {};
    this.accountantService.getMoneyAccounts(params, 0, 10000).subscribe((data) => {
      this.moneyAccounts = data;
    });
  }

  okClick(): void {
    let date = this.dateService.getDateNow();
    let data = {
      title: `Phiếu thanh toán công nợ ngày ${date} bởi ${this.account?.username}`,
      billCode: this.data.billCode,
      moneyAccountId: this.form.get("moneyAccountId")?.value,
      objectTypeId: 2,
      objectId: this.data.shop.id,
      totalMoney: this.configService.getCurrencyValue(this.form.get("totalMoney")?.value),
      description: this.form.get("description")?.value
    };

    this.accountantService.createPartnerClearingDebt(data)
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

}