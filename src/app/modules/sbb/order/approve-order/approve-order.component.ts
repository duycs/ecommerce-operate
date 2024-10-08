import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-approve-order',
  templateUrl: './approve-order.component.html',
})

export class ApproveOrderComponent implements OnInit {
  displayedColumns: string[] = ['name', 'customer', 'status', 'totalPrice'];
  orders!: any;

  constructor(
    private alertService: AlertService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<ApproveOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log("data", this.data);
    this.orders = this.data;
    this.orders = [...new Map(this.orders.map((m: any) => [m.id, m])).values()];
  }

  okClick(): void {
    this.orderService.updateOrderConfirm(this.orders[0].id).subscribe(o => {
      this.alertService.showToastSuccess();
    }, (error: any) => {
      this.alertService.showToastError();
    }
    );

    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}