import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-order-transfer-detail',
  templateUrl: './order-transfer-detail.component.html',
  styleUrls: ['./order-transfer-detail.component.css']
})

export class OrderTransferDetailComponent implements OnInit, AfterViewInit {
  orderId!: any;
  orderDetail!: any;
  displayedColumns: string[] = ['orderNumber', 'name', 'sku', 'importedQuantity', 'quantity', 'discount', 'totalPrice', 'action'];
  displayedOrderColumns: string[] = ['numericalOrder', 'code', 'supplier', 'quantity', 'totalPrice',
        'processStatus', 'quantityStatus', 'note', 'action'];
  dataSource = new MatTableDataSource<any>();
  dataSourceOrder = new MatTableDataSource<any>();

  constructor(
    private router: Router,
    private orderService: OrderService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private mappingModels: MappingModels,
  ) { }

  ngAfterViewInit(): void {
    this.getOrder();
    this.getOrderReceiptImport();
  }

  ngOnInit(): void {
    this.orderId = this.activeRoute.snapshot.params['id'];
  }

  okClick(): void {
  }

  getOrder() {
    this.orderService.getOrderDelivery(this.orderId)
      .subscribe(res => {
        this.orderDetail = this.mappingModels.MappingDisplayReceiptStatusChips(res);
        this.orderDetail.quantityStatusChips = this.mappingModels.MappingDisplayQuantityStatusByQuantityChips(this.orderDetail.importedQuantity, this.orderDetail.quantity);
        this.dataSource = res.products;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  getOrderReceiptImport() {
    let queryParams: any = {
      deliveryOrderId: this.orderId
    };

    this.orderService.getOrderReceiptImports(queryParams, 0, 1000)
      .subscribe(data => {
        
        this.dataSourceOrder.data = this.mappingModels.MappingDisplayFieldsOfOrderEnters(data);
      });
  }

  refresh() {

  }

  addOrderEnter() {
    this.router.navigate([`/sbb/create-order-enter`], { queryParams: { orderId: this.orderId } });
  }

  openRemoveOrderEnterDialog(element: any) { }

  openImportDetail(element: any){
    this.router.navigateByUrl(`/sbb/order-enters/${element.id}`);
  }

  openProductDetail(element: any) {
    this.router.navigateByUrl(`sbb/products/${element.id}`);
}

}