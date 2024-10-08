import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AccountantService } from 'src/app/services/accountant.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { PostService } from 'src/app/services/post.service';
import { ProductService } from 'src/app/services/product.service';
import { SettingService } from 'src/app/services/setting.service';
import { ShopService } from 'src/app/services/shop.service';
import { StaffService } from 'src/app/services/staff.service';
import { TemplateService } from 'src/app/services/template.service';
import { TransporterService } from 'src/app/services/transporter.service';



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, AfterViewInit {
  message!: string;
  count: number = 0;

  data: any = {};

  constructor(private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private shopService: ShopService,
    private transporterService: TransporterService,
    private accountantService: AccountantService,
    private postService: PostService,
    private settingService: SettingService,
    private staffService: StaffService,
    private templateService: TemplateService
  ) {

  }

  ngAfterViewInit() {
    this.productService.getCount().subscribe((res) => {
      this.data.productCount = res;
    });

    this.orderService.getOrderCount().subscribe((res) => {
      this.data.orderCount = res;
    });

    this.orderService.getOrderSupplierCount().subscribe((res) => {
      this.data.orderSupplierCount = res;
    });

    this.orderService.getOrderDeliveryCount().subscribe((res) => {
      this.data.orderDeliverCount = res;
    });

    this.orderService.getOrderReceiptExportCount().subscribe((res) => {
      this.data.orderReceiptExportCount = res;
    });

    this.orderService.getOrderReceiptImportCount().subscribe((res) => {
      this.data.orderReceiptImportCount = res;
    });

    this.customerService.getCustomers({}, 0, 10000).subscribe((res) => {
      this.data.customerCount = res;
    });

    this.shopService.getShops({}, 0, 10000).subscribe((res) => {
      this.data.shopCount = res;
    });

    this.transporterService.getTransporterCount({}).subscribe((res) => {
      this.data.transporterCount = res;
    });

    this.accountantService.getMoneyTransactionCount({}).subscribe((res) => {
      this.data.transactionCount = res;
    });

    this.productService.getProductInOrderCount({}).subscribe((res) => {
      this.data.productInOrderCount = res;
    });

    this.postService.getPostCount({}).subscribe((res) => {
      this.data.postsCount = res;
    });
    
    this.accountantService.getPartnerClearingDebtCount({}).subscribe((res) => {
      this.data.partnerClearingDebtCount = res;
    });

    this.staffService.getStaffCount({}).subscribe((res) => {
      this.data.staffCount = res;
    });

    this.staffService.getStaffCount({}).subscribe((res) => {
      this.data.staffCount = res;
    });

    this.templateService.getCountTemplates({}).subscribe((res) => {
      this.data.templateCount = res;
    });

    this.data.printCount = 0;
    this.data.departmentCount = 0;
  }

  ngOnInit(): void {

  }


}