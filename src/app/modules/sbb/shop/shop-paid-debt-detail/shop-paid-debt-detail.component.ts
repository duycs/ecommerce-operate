import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
  selector: 'app-shop-debt-detail',
  templateUrl: './shop-paid-debt-detail.component.html',
})

export class ShopPaidDebtDetailComponent implements OnInit {
  form!: FormGroup;
  currentUserSubscription!: Subscription;
  textMoney: string = '';

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private configService: ConfigService,
    public dialogRef: MatDialogRef<ShopPaidDebtDetailComponent>,
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

}