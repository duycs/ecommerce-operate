import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrintService } from 'src/app/services/print.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
  selector: 'app-money-pay-detail',
  templateUrl: './money-pay-detail.component.html',
})

export class MoneyPayDetailComponent implements OnInit {
  textMoney: any = "";
  
  constructor(
    private configService: ConfigService,
    private printService: PrintService,
    public dialogRef: MatDialogRef<MoneyPayDetailComponent>,
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

  print() {
    this.printService.printMoneyPay(this.data.id);
  }

}