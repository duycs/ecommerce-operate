import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { OrderDataSource } from './order-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OrderDto } from 'src/app/shared/models/order/orderDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { DateService } from 'src/app/shared/date.service';
import { ApproveOrderComponent } from '../approve-order/approve-order.component';
import { OrderDetailItemDialogComponent } from '../order-detail-item-dialog/order-detail-item-dialog.component';
import { PrintService } from 'src/app/services/print.service';
import { OrderDeliverForCustomerComponent } from '../order-deliver-for-customer/order-deliver-for-customer.component';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
})

export class OrderListComponent implements OnInit {
    selection = new SelectionModel<OrderDto>(true, []);
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "orderDate",
            name: "khoảng ngày đặt",
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
            name: "khách hàng",
            type: "option",
            select: "one",
            values: [],
            viewValues: "",
            isSelected: false
        },
        {
            id: "status",
            name: "trạng thái đơn",
            type: "option",
            select: "one",
            options: [
                { index: 0, id: "0", name: 'tất cả', isSelected: false },
                { index: 1, id: "1", name: 'chờ xác nhận', isSelected: false },
                { index: 2, id: "2", name: 'đang xử lý', isSelected: false },
                { index: 3, id: "3", name: 'đã giao hàng', isSelected: false },
                { index: 4, id: "4", name: 'từ chối', isSelected: false },
                { index: 5, id: "5", name: 'đã hủy', isSelected: false },
            ],
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
    displayedColumns: string[] = ['selection', 'numericalOrder', 'code', 'customer', 'orderNumber', 'staff', 'quantity',
        'quantityDeliver', 'discount', 'totalPrice', 'processStatus', 'orderDate', 'action'];

    dataSource!: OrderDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private AuthService: AuthService,
        private printService: PrintService,
        private dateService: DateService,
        private customerService: CustomerService,
        private orderService: OrderService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        this.dataSource = new OrderDataSource(this.mappingModels, this.orderService);
        //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngAfterViewInit() {
        this.initFilterCustomerOptions();
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["orderDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["orderDate"];
            queryParams = this.dateService.getQueryDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["customerId"]) queryParams.customerId = this.activeRoute.snapshot.queryParams["customerId"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["status"]) queryParams.status = this.activeRoute.snapshot.queryParams["status"];
        if (this.activeRoute.snapshot.queryParams["productSku"]) queryParams.productSku = this.activeRoute.snapshot.queryParams["productSku"];

        return queryParams;
    }

    initFilterCustomerOptions() {
        let customerQueryParams = {} as any;
        this.customerService.getCustomers(customerQueryParams, 0, 10000).subscribe((pageData) => {
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
        this.router.navigateByUrl(`/sbb/orders/${element.id}`)
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
                console.log("select", row);
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

    createDeliveryOrder() {
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
            console.log("confirmDeliveryAnOrder", order);
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    approveOrder(order: any) {
        const dialogRef = this.dialog.open(ApproveOrderComponent, {
            data: [order],
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log("ApproveOrderComponent", order);
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    openOrderDetailItemDialog(orderId: any) {
        console.log("open", orderId);
        const dialogRef = this.dialog.open(OrderDetailItemDialogComponent, {
            data: orderId,
        });

        dialogRef.afterClosed().subscribe(() => {
        });
    }

    print(element: any) {
        this.printService.printOrder(element.id);
    }


    openOrderDeliverForCustomer(data: any = {}) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        dialogConfig.width = '50vw';
    
        const dialogRef = this.dialog.open(OrderDeliverForCustomerComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
        });
      }
}