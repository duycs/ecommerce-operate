import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderSubDetailItemDialogComponent } from '../order-sub-detail-item-dialog/order-sub-detail-item-dialog.component';

@Component({
  selector: 'app-order-sub-detail',
  templateUrl: './order-sub-detail.component.html',
})

export class OrderSubDetailComponent implements OnInit, AfterViewInit {
  orderId!: any;
  orderDetail!: any;
  notDisplayedColumns = ['action'];

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private mappingModels: MappingModels,
    private printService: PrintService,
    private dialog: MatDialog,
  ) { }

  ngAfterViewInit(): void {
    this.getOrder();
  }

  ngOnInit(): void {
    this.orderId = this.activeRoute.snapshot.params['id'];
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

  confirmDeliveryOrder() {

  }

  updatePriorityDeliver() {

  }

  print() {
    this.printService.printOrderSub(this.orderId);
  }

  openOrderDetailItemDialog() {
    const dialogRef = this.dialog.open(OrderSubDetailItemDialogComponent, {
      data: this.orderId,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

}