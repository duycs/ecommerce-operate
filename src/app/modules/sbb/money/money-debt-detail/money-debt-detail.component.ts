import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
  selector: 'app-money-debt-detail',
  templateUrl: './money-debt-detail.component.html',
})

export class MoneyDebtDetailComponent implements OnInit {
  textMoney: string = '';

  constructor(
    private configService: ConfigService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<MoneyDebtDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
      this.textMoney = this.configService.getCurrencyInVietnamWord(this.data.totalMoney);
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