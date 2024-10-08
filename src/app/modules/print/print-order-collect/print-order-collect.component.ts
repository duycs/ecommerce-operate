import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-print-order-collect',
  templateUrl: './print-order-collect.component.html',
})
export class PrintOrderCollectComponent implements OnInit {
  data: any;
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
    if (!this.data) {
      this.orderService.getOrderReceiptPickups({ id: this.id }, 0, 1)
        .subscribe(res => {
          console.log(res);
          if (res && res.length > 0) {
            console.log(res);
            
            this.data = res[0].content;
            this.printService.onDataReady();
          }
        }, (err) => {
          this.alertService.showToastError();
          console.log(err);
        });
    }
  }


}