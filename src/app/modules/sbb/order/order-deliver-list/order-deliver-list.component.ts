import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { OrderDeliverDataSource } from './order-deliver-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OrderDto } from 'src/app/shared/models/order/orderDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { ShopService } from 'src/app/services/shop.service';
import { DateService } from 'src/app/shared/date.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
    selector: 'app-order-deliver-list',
    templateUrl: './order-deliver-list.component.html',
})

export class OrderDeliverListComponent implements OnInit {
    currentUser!: any;
    currentUserSubscription!: Subscription;
    selection = new SelectionModel<OrderDto>(true, []);
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "createdDate",
            name: "khoảng ngày tạo",
            type: "dateRange",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "code",
            name: "mã đơn",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "customerId",
            name: "người mua",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "shopId",
            name: "nhà cung cấp",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdBy",
            name: "nhân viên",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "productSku",
            name: "sku sản phẩm",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    confirmDelivery = false;
    addDelivery = true;
    searchKeywords: any[] = [];

    title: string = "Order";
    displayedColumns: string[] = ['selection', 'numericalOrder', 'code', 'customer', 'employee', 'quantityStatus', 'quantity',
        'totalPrice', 'action'];

    dataSource!: OrderDeliverDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private AuthService: AuthService,
        private customerService: CustomerService,
        private shopService: ShopService,
        private orderService: OrderService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private mappingModels: MappingModels,
        private dateService: DateService,
        private printService: PrintService,
        private alertService: AlertService) {
        this.dataSource = new OrderDeliverDataSource(this.mappingModels, this.orderService);
    }

    ngAfterViewInit() {
        this.initFilterShopOptions();
        this.initFilterCustomerOptions();
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["shopId"]) queryParams.shopId = this.activeRoute.snapshot.queryParams["shopId"];

        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];

        if (this.activeRoute.snapshot.queryParams["customerId"]) queryParams.customerId = this.activeRoute.snapshot.queryParams["customerId"];

        if (this.activeRoute.snapshot.queryParams["shopName"]) queryParams.shopName = this.activeRoute.snapshot.queryParams["shopName"];

        if (this.activeRoute.snapshot.queryParams["createdBy"]) queryParams.createdBy = this.activeRoute.snapshot.queryParams["createdBy"];
        if (this.activeRoute.snapshot.queryParams["productSku"]) queryParams.productSku = this.activeRoute.snapshot.queryParams["productSku"];

        return queryParams;
    }

    initFilterShopOptions() {
        this.shopService.getShops({} as any, 0, 10000).subscribe((pageData) => {
            let options = pageData.data;
            this.allOptions.map(o => {
                if (o.id === 'shopId') {
                    o.options = options;
                }
            });
        });
    }

    initFilterCustomerOptions() {
        this.customerService.getCustomers({} as any, 0, 10000).subscribe((pageData) => {
            let options = pageData.data;
            this.allOptions.map(o => {
                if (o.id === 'customerId') {
                    o.options = options;
                }
            });
        });
    }

    updateSearch(event: any) {
        this.dataSource.loadData(this.getQueryParams());
    }

    loadPage() {
        this.dataSource.loadData(
            this.getQueryParams(),
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.direction
        );
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.loadPage();
    }

    openDetail(element: any) {
        this.router.navigateByUrl(`/sbb/order-delivers/${element.id}`)
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.pageSize;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.dataSubject.forEach((row: any) => {
                this.selection.isSelected(row);
            });
    }

    changeSelect(element: any) {
        if (element) {
            this.selection.toggle(element);
        }
    }

    refresh() {
        this.loadPage();
        this.confirmDelivery = false;
        this.addDelivery = true;
    }

    addDeliveryOrder() {
        this.confirmDelivery = true;
        this.addDelivery = false;
    }

    confirmDeliveryOrder() {
        const dialogRef = this.dialog.open(ConfirmOrderComponent, {
            data: this.selection.selected,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    confirmDeliveryAnOrder(order: any) {
        const dialogRef = this.dialog.open(ConfirmOrderComponent, {
            data: [order],
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    createOrderDeliver(element: any) {
        this.router.navigate([`/sbb/create-order-deliver`], { queryParams: { orderId: element.id } });
    }

    print(element: any) {
        this.printService.printOrderDeliver(element.id);
    }
}