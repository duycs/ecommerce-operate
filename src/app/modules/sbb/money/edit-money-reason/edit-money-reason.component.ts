import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountantService } from 'src/app/services/accountant.service';

@Component({
  selector: 'app-edit-money-reason',
  templateUrl: './edit-money-reason.component.html',
})

export class EditMoneyReasonComponent implements OnInit {
  form!: FormGroup;
  currentUserSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private accountantService: AccountantService,
    public dialogRef: MatDialogRef<EditMoneyReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.data = this.data;

    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      description: [this.data.description, Validators.required],
      reasonTypeId: [this.data.reasonTypeId + "", Validators.required],
      isActive: [this.data.isActive + "", Validators.required],
    });

  }

  okClick(): void {
    let data = {
      name: this.form.get("name")?.value,
      description: this.form.get("description")?.value,
      reasonTypeId: ~~this.form.get("reasonTypeId")?.value,
      isActive: this.form.get("isActive")?.value
    };

    this.accountantService.updateMoneyReason(this.data.id, data)
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