import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailDto } from 'src/app/shared/models/order/orderDetailDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-order-enter-detail',
  templateUrl: './order-enter-detail.component.html',
})

export class OrderEnterDetailComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  orderId!: any;
  orderDetail!: any;
  staffNote: string = '';
  notDisplayedColumns = ['price', 'percentDiscount', 'cashDiscount', 'totalPrice', 'action'];

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
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
    this.orderService.getOrderReceiptImport(this.orderId)
      .subscribe(res => {
        this.orderDetail = this.mappingModels.MappingDisplayReceiptStatusChips(res);
        this.orderDetail.deliveryOrderStatusChips = this.mappingModels.MappingDeliveryOrderStatus(this.orderDetail.deliveryOrder.deliveryOrderStatus);
        this.orderDetail.quantityStatusChips = this.mappingModels.MappingDisplayQuantityStatusByQuantityChips(this.orderDetail.importedQuantity, this.orderDetail.deliveryOrder.quantity);
        this.orderDetail.products.forEach((p: any) => p.totalQuantity = p.quantity);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  edit() {

  }


}