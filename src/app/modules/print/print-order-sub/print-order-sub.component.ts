import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-print-order-sub',
  templateUrl: './print-order-sub.component.html',
  styleUrls: ['./print-order-sub.component.css']
})
export class PrintOrderSubComponent implements OnInit {

  current: any = new Date();
  orderDetail: any;
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
    this.orderService.getOrderSupplier(this.id)
      .subscribe(res => {
        
        if (res) {
          this.orderDetail = this.mappingModels.MappingDisplayFieldsOfOrderDetail(res);
          this.printService.onDataReady();
        }
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }


}