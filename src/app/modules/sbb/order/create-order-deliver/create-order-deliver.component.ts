import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-order-deliver',
  templateUrl: './create-order-deliver.component.html',
})

export class CreateOrderDeliverComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  currentUser!: any;
  orderId!: any;
  orderDetail!: any;
  current!: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private mappingModels: MappingModels,
  ) { }

  ngAfterViewInit(): void {
    this.getOrderDetail();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      paymentId: [null, Validators.required],
      deliveryAddress: [null, Validators.required],
      customerPaid: [null],
      note: [null],
    });
    this.current = new Date();
    this.orderId = this.activeRoute.snapshot.params['id'];
  }

  okClick(): void {
  }

  getOrderDetail() {
    this.orderId = this.activeRoute.snapshot.queryParams["orderId"];
    this.orderService.getOrderReceiptExport(this.orderId).subscribe((res: any) => {
        this.orderDetail = this.mappingModels.MappingDisplayReceiptStatusChips(res);
    });
  }

  save() {
    let products = [];
    let productChilds = [{
      "Id": "57aa990f-b543-4478-9efb-7d56a7c9ed0c",
      "Quantity": 12
    }];

    products.push(productChilds);

    let data = {
      Note: this.form.get('note')?.value,
      Products: products
    };

    this.orderService.createOrderDeliveryImport(this.orderId, data).subscribe((res: any) => {
      this.alertService.showToastSuccess();
    }, (err) => {
      this.alertService.showToastError();
    });
  }

  addProduct() {
  }

  print() {
    console.log('print')
  }

  edit() {

  }


}