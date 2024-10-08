import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';

@Component({
  selector: 'app-order-sub-detail-item-dialog',
  templateUrl: './order-sub-detail-item-dialog.component.html',
  styleUrls: ['./order-sub-detail-item-dialog.component.css']
})

export class OrderSubDetailItemDialogComponent implements OnInit {
  orderId!: any;
  orderDetail!: any;

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private mappingModels: MappingModels,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<OrderSubDetailItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.orderId = this.data;
    this.getOrder();
  }

  okClick(): void {
  }

  getOrder() {
    this.orderService.getOrderSupplier(this.orderId)
      .subscribe(res => {
        if (res) {
          this.orderDetail = this.mappingModels.MappingDisplayFieldsOfOrderDetail(res);
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