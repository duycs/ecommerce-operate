import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-image-order-deliver',
  templateUrl: './image-order-deliver.component.html'
})
export class ImageOrderDeliverComponent implements OnInit {
  current: any = new Date();
  orderDetail: any;
  customerPhoneHidden = "";
  @Input() id!: any;

  constructor(
    private activedRoute: ActivatedRoute,
    private orderService: OrderService,
    private mappingModels: MappingModels,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.getOrder();
  }

  getOrder() {
    this.orderService.getOrderReceiptExport(this.id)
      .subscribe(res => {
        this.orderDetail = res;
        this.orderDetail.products.forEach((c: any) => {
          c.totalQuantity = c.quantity
        });
        this.customerPhoneHidden = this.mappingModels.replaceCustomerPhone(this.orderDetail.customer.phoneNumber);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }


}