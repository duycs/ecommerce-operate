import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-money-collect-detail',
  templateUrl: './money-collect-detail.component.html',
})

export class MoneyCollectDetailComponent implements OnInit {
  form!: FormGroup;
  currentUserSubscription!: Subscription;
  textMoney: string = '';

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    private printService: PrintService,
    public dialogRef: MatDialogRef<MoneyCollectDetailComponent>,
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
    this.printService.printMoneyCollect(this.data.id);
  }

}