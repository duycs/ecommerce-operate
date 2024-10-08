import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailDto } from 'src/app/shared/models/order/orderDetailDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';

import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-order-deliver-detail',
  templateUrl: './order-deliver-detail.component.html',
})

export class OrderDeliverDetailComponent implements OnInit, AfterViewInit {
  orderId!: any;
  orderDetail!: any;
  notDisplayedColumns = ['percentDiscount', 'cashDiscount', 'action'];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private printService: PrintService,
    private mappingModels: MappingModels,
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
    this.orderService.getOrderReceiptExport(this.orderId)
      .subscribe(res => {
        this.orderDetail = res;
        this.orderDetail.products.forEach((c: any) => {
          c.totalQuantity = c.quantity
        });
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
    this.printService.printOrderDeliver(this.orderId);
  }

}