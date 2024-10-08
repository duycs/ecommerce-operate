import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountantService } from 'src/app/services/accountant.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
  selector: 'app-create-money-account',
  templateUrl: './create-money-account.component.html',
})

export class CreateMoneyAccountComponent implements OnInit {
  form!: FormGroup;
  accountTypes: any[] = [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Tài khoản ngân hàng" },
    { id: 3, name: "Ví điện tử" }
  ];

  currencies: any[] = [
    { id: 1, name: "VND" },
    { id: 2, name: "CYN" }
  ];
  moneyAccount: any = [];
  name!: string;
  code!: string;
  suggestCode: string = '';
  suggestName: string = '';

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private alertService: AlertService,
    private accountantService: AccountantService,
    public dialogRef: MatDialogRef<CreateMoneyAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      currencyTypeId: [null, Validators.required],
      accountTypeId: [null, Validators.required],
      description: [null],
    });

    this.data = this.data;
    this.getMoneyAccount();

    this.form.get("name")?.valueChanges.subscribe((value: any) => {
      this.suggestName = this.configService.getNoWhiteSpace(value);
    });

    this.form.get("code")?.valueChanges.subscribe((value: any) => {
      this.suggestCode = this.configService.getNoWhiteSpace(value);
    });
  }

  getMoneyAccount(field: string = '', value: string = '') {
    let queryParams: any = {};
    if (field === 'name') {
      queryParams.name = value;
    }

    if (field === 'code') {
      queryParams.code = value;
    }

    this.accountantService.getMoneyAccounts(queryParams, 0, 1000)
      .subscribe((res: any) => {
        this.moneyAccount = res;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  outputCode(event: any){
    this.code = event.value;
    this.getMoneyAccount("code", this.code);
  }

  outputName(event: any){
    this.name = event.value;
    this.getMoneyAccount("name", this.name);
  }

  okClick(): void {
    let data = {
      code: this.code,
      name: this.name,
      currencyTypeId: this.form.get("currencyTypeId")?.value,
      accountTypeId: this.form.get("accountTypeId")?.value,
      description: this.form.get("description")?.value
    };

    this.accountantService.createMoneyAccount(data)
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