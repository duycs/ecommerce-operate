import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
  selector: 'app-customer-debt-detail',
  templateUrl: './customer-debt-detail.component.html',
})

export class CustomerDebtDetailComponent implements OnInit {
  textMoney: string = '';

  constructor(
    private configService: ConfigService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<CustomerDebtDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
      this.textMoney = this.configService.getCurrencyInVietnamWord(this.data.amount);
  }

  okClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  print(){

  }

}