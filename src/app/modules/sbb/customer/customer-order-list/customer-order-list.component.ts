import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomerOrderDataSource } from './customer-order-data-source';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';
import { environment } from 'src/environments/environment';
import { ConfirmOrderComponent } from '../../order/confirm-order/confirm-order.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { OrderDto } from 'src/app/shared/models/order/orderDto';
import { ApproveOrderComponent } from '../../order/approve-order/approve-order.component';
import { OrderDetailItemDialogComponent } from '../../order/order-detail-item-dialog/order-detail-item-dialog.component';
import { PrintService } from 'src/app/services/print.service';

@Component({
    selector: 'app-customer-order-list',
    templateUrl: './customer-order-list.component.html',
})

export class CustomerOrderListComponent implements OnInit {
    @Input() statistic!: any;
    @Input() customer!: any;
    selection = new SelectionModel<OrderDto>(true, []);
    id!: any;
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

    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numericalOrder', 'code', 'orderNumber', 'staff', 'quantityOrder', 'quantityDelivery', 'cashDiscount', 'price', 'processStatus', 'orderDate', 'action'];

    dataSource!: CustomerOrderDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private mappingModels: MappingModels,
        private orderService: OrderService,
        private dateService: DateService,
        private activedRoute: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private printService: PrintService,
        private alertService: AlertService) {
        this.dataSource = new CustomerOrderDataSource(this.orderService, this.mappingModels);
    }

    ngAfterViewInit() {
        console.log('statistic', this.statistic);
    }

    ngOnInit(): void {
        this.id = this.activedRoute.snapshot.params['id'];
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activedRoute.snapshot.queryParams["orderDate"]) {
            let createdDate = this.activedRoute.snapshot.queryParams["orderDate"];
            queryParams = this.dateService.getQueryDates(queryParams, createdDate)
        }

        if (this.activedRoute.snapshot.queryParams["customerId"]) queryParams.customerId = this.activedRoute.snapshot.queryParams["customerId"];
        if (this.activedRoute.snapshot.queryParams["code"]) queryParams.code = this.activedRoute.snapshot.queryParams["code"];
        if (this.activedRoute.snapshot.queryParams["status"]) queryParams.status = this.activedRoute.snapshot.queryParams["status"];
        if (this.activedRoute.snapshot.queryParams["productSku"]) queryParams.productSku = this.activedRoute.snapshot.queryParams["productSku"];

        queryParams.customerId = this.id;

        return queryParams;
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

    remove(element: any) {

    }

    openDetail(element: any) {
        this.router.navigateByUrl(`/sbb/orders/${element.id}`)
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

    print(element: any) {
        this.printService.printOrder(element.id);
    }

}