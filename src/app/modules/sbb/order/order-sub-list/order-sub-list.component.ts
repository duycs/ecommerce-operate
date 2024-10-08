import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { OrderDataSource } from './order-sub-data-source';
import { AlertService } from 'src/app/services/alert.service';

import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OrderDto } from 'src/app/shared/models/order/orderDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { ShopService } from 'src/app/services/shop.service';
import { DateService } from 'src/app/shared/date.service';
import { OrderSubDetailItemDialogComponent } from '../order-sub-detail-item-dialog/order-sub-detail-item-dialog.component';
import { PrintService } from 'src/app/services/print.service';

@Component({
    selector: 'app-order-sub-list',
    templateUrl: './order-sub-list.component.html',
})

export class OrderSubListComponent implements OnInit {
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
            name: "khoảng ngày đặt",
            type: "dateRange",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "code",
            name: "mã đơn con",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "orderCode",
            name: "mã đơn tổng",
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
    displayedColumns: string[] = ['selection', 'numericalOrder', 'orderCode',  'code',  'customer', 'staff', 'supplier',
        'quantityDeliver', 'quantityOrder', 'discount', 'totalPrice', 'processStatus', 'orderDate', 'action'];

    dataSource!: OrderDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dateService: DateService,
        private customerService: CustomerService,
        private shopService: ShopService,
        private orderService: OrderService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private mappingModels: MappingModels,
        private printService: PrintService,
        private alertService: AlertService) {
        this.dataSource = new OrderDataSource(this.mappingModels, this.orderService);
    }

    ngAfterViewInit() {
        this.initFilterCustomerOptions();
        this.initFilterShopOptions();
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

        if (this.activeRoute.snapshot.queryParams["customerId"]) queryParams.customerId = this.activeRoute.snapshot.queryParams["customerId"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["orderCode"]) queryParams.orderCode = this.activeRoute.snapshot.queryParams["orderCode"];
        if (this.activeRoute.snapshot.queryParams["status"]) queryParams.status = this.activeRoute.snapshot.queryParams["status"];
        if (this.activeRoute.snapshot.queryParams["shopId"]) queryParams.shopId = this.activeRoute.snapshot.queryParams["shopId"];
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
        this.router.navigateByUrl(`/sbb/order-subs/${element.id}`)
    }

    openOrderDetailItemDialog(orderId: any) {
        console.log("open", orderId);
        const dialogRef = this.dialog.open(OrderSubDetailItemDialogComponent, {
            data: orderId,
        });

        dialogRef.afterClosed().subscribe(() => {
        });
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
        console.log("changeSelect", this.selection.selected);
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
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    print(element: any) {
        this.printService.printOrderSub(element.id);
    }
}