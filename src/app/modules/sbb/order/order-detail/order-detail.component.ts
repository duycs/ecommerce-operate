import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailDto } from 'src/app/shared/models/order/orderDetailDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { ApproveOrderComponent } from '../approve-order/approve-order.component';
import { PrintService } from 'src/app/services/print.service';
import { OrderDetailItemDialogComponent } from '../order-detail-item-dialog/order-detail-item-dialog.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
})

export class OrderDetailComponent implements OnInit, AfterViewInit {
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
    this.orderService.getOrder(this.orderId)
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
    const dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: [{
        id: this.orderDetail.detail.id,
        code: this.orderDetail.detail.code, customerName: this.orderDetail.detail.customerName,
        processStatusChips: this.orderDetail.detail?.processStatusChips, totalPrice: this.orderDetail.detail.totalPrice
      }],
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getOrder();
      }, environment.loadTimeout);
    });
  }

  updatePriorityDeliver() {

  }

  print() {
    this.printService.printOrder(this.orderId);
  }

  approveOrder() {
    const dialogRef = this.dialog.open(ApproveOrderComponent, {
      data: [{
        id: this.orderDetail.detail.id,
        code: this.orderDetail.detail.code, customerName: this.orderDetail.detail.customerName,
        processStatusChips: this.orderDetail.detail?.processStatusChips, totalPrice: this.orderDetail.detail.totalPrice
      }],
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getOrder();
      }, environment.loadTimeout);
    });
  }

  openOrderDetailItemDialog() {
    const dialogRef = this.dialog.open(OrderDetailItemDialogComponent, {
      data: this.orderId,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

}