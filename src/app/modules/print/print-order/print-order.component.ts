import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {

  current!: any;
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
    this.current = new Date();
    this.getOrderThenPrint();
  }

  getOrderThenPrint() {
    this.orderService.getOrder(this.id)
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