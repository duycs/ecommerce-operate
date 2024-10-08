import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDeliverForCustomerComponent } from '../order-deliver-for-customer/order-deliver-for-customer.component';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
})

export class ConfirmOrderComponent implements OnInit {
  currentUserSubscription!: Subscription;
  orders!: any;
  displayedColumns: string[] = ['name', 'customer', 'status', 'totalPrice'];

  constructor(
    private alertService: AlertService,
    private orderService: OrderService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.orders = this.data;
    this.orders = [...new Map(this.orders.map((m: any) => [m.id, m])).values()];
  }

  okClick(): void {
    let orderIds = this.orders.map((o: any) => o.id);

    if (orderIds && orderIds.length > 0) {
      let data = { OrderIds: orderIds };

      this.orderService.createOrderReceiptExport(data).subscribe((res: any) => {
        this.alertService.showToastSuccess();
        if (res && res.length > 0) {
          this.openOrderDeliverForCustomer(res);
        }
      }, (error: any) => {
        this.alertService.showToastError();
      }
      );
    } else {
      this.alertService.showToastMessage("Cần chọn đơn hàng");
    }

    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  openOrderDeliverForCustomer(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '50vw';

    const dialogRef = this.dialog.open(OrderDeliverForCustomerComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
    });
  }

}