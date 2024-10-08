import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-order-detail-item-dialog',
  templateUrl: './order-detail-item-dialog.component.html',
  styleUrls: ['./order-detail-item-dialog.component.css']
})

export class OrderDetailItemDialogComponent implements OnInit {
  orderId!: any;
  orderDetail!: any;

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private mappingModels: MappingModels,
    public dialogRef: MatDialogRef<OrderDetailItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.orderId = this.data;
    this.getOrder();
  }

  okClick(): void {
  }

  getOrder() {
    this.orderService.getOrder(this.orderId)
      .subscribe(res => {
        if (res) {
          this.orderDetail = this.mappingModels.MappingDisplayFieldsOfOrderDetail(res);
          console.log(this.orderDetail);
        }
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }
  
  close() {
    this.dialogRef.close();
  }
}