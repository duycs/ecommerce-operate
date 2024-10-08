import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-order-collect-detail',
  templateUrl: './order-collect-detail.component.html',
})

export class OrderCollectDetailComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  id!: any;
  detail!: any;
  staffNote: string = '';
  notDisplayedColumns = ['price', 'percentDiscount', 'cashDiscount', 'totalPrice', 'action'];

  constructor(
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
    this.id = this.activeRoute.snapshot.params['id'];
  }

  okClick(): void {
  }

  getOrder() {
    this.orderService.getOrderReceiptPickup(this.id)
      .subscribe(res => {
        console.log(res);
        this.detail = res;
        this.detail.products.forEach((c: any) => {
          c.totalQuantity = c.quantity
        });
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  print() {
    this.printService.printOrderCollect(this.id);
    this.orderService.requeueOrderReceiptPickups(this.id).subscribe((res: any) => {
      this.alertService.showToastSuccess();
  });
  }

}