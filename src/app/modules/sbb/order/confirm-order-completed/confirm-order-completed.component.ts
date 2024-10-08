import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-confirm-order-completed',
  templateUrl: './confirm-order-completed.component.html',
})

export class ConfirmOrderCompletedComponent implements OnInit {
  orders: any = [];
  displayedColumns: string[] = ['code', 'shop', 'quantityImported', 'totalImportedPrice'];

  constructor(
    private alertService: AlertService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<ConfirmOrderCompletedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.orders = this.data;
    this.orders = [...new Map(this.orders.map((m: any) => [m.id, m])).values()];
  }

  okClick(): void {
    if (this.orders && this.orders.length > 0) {
      let order = this.orders[0];

      let formData = {
        deliveryOrderId: order.id,
        totalMoney: order.totalImportedPrice,
        currencyTypeId: 1 // 1: VND, 2: CNY
      };

      console.log("formData", formData);

      this.orderService.updateDeliveryCompleted(order.id, formData)
        .subscribe(() => {
          this.alertService.showToastSuccess();
        }, (err) => {
          this.alertService.showToastError();
          console.log(err);
        });

    } else {
      this.alertService.showToastMessage("Cần chọn đơn hàng");
    }

    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}