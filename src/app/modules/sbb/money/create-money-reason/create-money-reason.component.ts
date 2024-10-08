import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountantService } from 'src/app/services/accountant.service';

@Component({
  selector: 'app-create-money-reason',
  templateUrl: './create-money-reason.component.html',
})

export class CreateMoneyReasonComponent implements OnInit {
  form!: FormGroup;
  currentUserSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private accountantService: AccountantService,
    public dialogRef: MatDialogRef<CreateMoneyReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      reasonTypeId: [1],
      isActive: [1]
    });

    this.data = this.data;
  }

  okClick(): void {
    let data = {
      name: this.form.get("name")?.value,
      description: this.form.get("description")?.value,
      reasonTypeId: ~~this.form.get("reasonTypeId")?.value,
      isActive: this.form.get("isActive")?.value == 1 ? true : false
    };

    this.accountantService.createMoneyReason(data)
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