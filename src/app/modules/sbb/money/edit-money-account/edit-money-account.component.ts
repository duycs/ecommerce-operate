import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountantService } from 'src/app/services/accountant.service';

@Component({
  selector: 'app-edit-money-account',
  templateUrl: './edit-money-account.component.html',
})

export class EditMoneyAccountComponent implements OnInit {
  form!: FormGroup;
  reasons: any[] = [
    { id: 1, name: "Lý do 1" },
    { id: 2, name: "Lý do khác" }

  ];

  accountTypes: any[] = [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Tài khoản ngân hàng" },
    { id: 3, name: "Ví điện tử" }
  ];

  currencies: any[] = [
    { id: 1, name: "VND" },
    { id: 2, name: "CYN" }
  ];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private accountantService: AccountantService,
    public dialogRef: MatDialogRef<EditMoneyAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      code: [this.data.code, Validators.required],
      accountTypeId: [this.data.accountTypeId, Validators.required],
      currencyTypeId: [this.data.currencyTypeId, Validators.required],
      description: [this.data.description],
    });
  }

  okClick(): void {
    let data = {
      code: this.form.get("code")?.value,
      name: this.form.get("name")?.value,
      currencyTypeId: this.form.get("currencyTypeId")?.value,
      accountTypeId: this.form.get("accountTypeId")?.value,
      description: this.form.get("description")?.value
    };

    this.accountantService.updateMoneyAccount(this.data.id, data)
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