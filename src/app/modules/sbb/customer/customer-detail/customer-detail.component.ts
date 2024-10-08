import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
})

export class CustomerDetailComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  customerId!: any;
  customerDetail!: any;
  orders: any = [];
  statistic: any = {};
  orderStatus = [
    { id: 0, name: "Unknown" },
    { id: 1, name: "Chờ xác nhận" },
    { id: 2, name: "Đang xử lý" },
    { id: 3, name: "Đã hoàn thành" },
    { id: 4, name: "Từ chối" },
    { id: 5, name: "Đã hủy" }
  ];

  constructor(
    private customerSerice: CustomerService,
    private orderService: OrderService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private mappingModels: MappingModels
  ) { }

  ngAfterViewInit(): void {
    this.getCustomer();
    this.getCustomerOrderThenStatistic();
  }
  

  ngOnInit(): void {
    this.customerId = this.activeRoute.snapshot.params['id'];
  }

  getCustomer() {
    this.customerSerice.getCustomer(this.customerId)
      .subscribe(res => {
        this.customerDetail = this.mappingModels.ToDisplayCustomerDto(res);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  getCustomerOrderThenStatistic() {
    let queryParams: any = {
      customerId: this.customerId
    };

    this.orderService.getOrders(queryParams, 0, 1000).pipe()
      .subscribe(data => {

        if (data && data.length > 0) {
          this.orders = this.mappingModels.MappingDisplayFieldsOfOrders(data);
          let pendingOrders = this.orders.filter((c: any) =>  c.orderStatus.Id === 0 || c.orderStatus.Id === 1); // chờ xác nhận
          let executingOrders = this.orders.filter((c: any) => c.orderStatus.Id === 2); // đang xử lý
          let completedOrders = this.orders.filter((c: any) => c.orderStatus.Id === 3); // đã giao hàng
          let deniedOrders = this.orders.filter((c: any) => c.orderStatus.Id === 4); // từ chối
          let cancelOrders = this.orders.filter((c: any) => c.orderStatus.Id === 5); // đã hủy

          this.statistic.totalOrderPending = pendingOrders?.length ?? 0;
          this.statistic.totalOrderExecuting = executingOrders?.length ?? 0;
          this.statistic.totalOrderCompleted = completedOrders?.length ?? 0;
          this.statistic.totalOrderDenied = deniedOrders?.length ?? 0;
          this.statistic.totalOrderCancel = cancelOrders?.length ?? 0;

          // total orders
          this.statistic.totalOrder = this.orders.length ?? 0;
          this.statistic.totalMoneyOrder = this.orders.map((c: any) => c.totalPrice)?.reduce(function (total: any, item: any) { return total += item });
          this.statistic.totalProduct = this.orders.map((c: any) => c.quantityOrdered)?.reduce(function (total: any, item: any) { return total += item });

          // total order Pending
          this.statistic.totalOrderPending = pendingOrders.length ?? 0;
          this.statistic.totalMoneyPending = pendingOrders?.map((c: any) => c.totalPrice)?.reduce(function (total: any, item: any) { return total += item });
          this.statistic.totalProductPending = pendingOrders?.map((c: any) => c.quantityOrdered)?.reduce(function (total: any, item: any) { return total += item });

          // total order executing
          this.statistic.totalOrderExecuting = executingOrders.length ?? 0;
          this.statistic.totalMoneyExecuting = executingOrders?.map((c: any) => c.totalPrice)?.reduce(function (total: any, item: any) { return total += item });
          this.statistic.totalProductExecuting = executingOrders?.map((c: any) => c.quantityOrdered)?.reduce(function (total: any, item: any) { return total += item });

          // total order Completed
          this.statistic.totalOrderCompleted = completedOrders.length ?? 0;
          this.statistic.totalMoneyCompleted = completedOrders?.map((c: any) => c.totalPrice)?.reduce(function (total: any, item: any) { return total += item });
          this.statistic.totalProductCompleted = completedOrders?.map((c: any) => c.quantityOrdered)?.reduce(function (total: any, item: any) { return total += item });

          // total order Denied
          this.statistic.totalOrderDenied = deniedOrders.length ?? 0;
          this.statistic.totalMoneyDenied = deniedOrders?.map((c: any) => c.totalPrice)?.reduce(function (total: any, item: any) { return total += item });
          this.statistic.totalProductDenied = deniedOrders?.map((c: any) => c.quantityOrdered)?.reduce(function (total: any, item: any) { return total += item });

          // total cancel
          this.statistic.totalOrderCancel = cancelOrders.length ?? 0;
          this.statistic.totalMoneyCancel = cancelOrders?.map((c: any) => c.totalPrice)?.reduce(function (total: any, item: any) { return total += item });
          this.statistic.totalProductCancel = cancelOrders?.map((c: any) => c.quantityOrdered)?.reduce(function (total: any, item: any) { return total += item });

          console.log("statisic in detail", this.statistic);
        }
      });
  }

}