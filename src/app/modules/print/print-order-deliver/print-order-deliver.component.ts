import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-print-order-deliver',
  templateUrl: './print-order-deliver.component.html',
  styleUrls: ['./print-order-deliver.component.css']
})
export class PrintOrderDeliverComponent implements OnInit {

  current: any = new Date();
  orderDetail: any;
  customerPhoneHidden = "";
  id!: any;

  constructor(
    private activedRoute: ActivatedRoute,
    private printService: PrintService,
    private orderService: OrderService,
    private mappingModels: MappingModels,
    private alertService: AlertService
  ) {
    this.id = this.activedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.getOrderThenPrint();
  }

  getOrderThenPrint() {
    this.orderService.getOrderReceiptExport(this.id)
      .subscribe(res => {
        this.orderDetail = res;
        this.orderDetail.products.forEach((c: any) => {
          c.totalQuantity = c.quantity
        });
        this.customerPhoneHidden = this.mappingModels.replaceCustomerPhone(this.orderDetail.customer.phoneNumber);
        this.printService.onDataReady();
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }


}