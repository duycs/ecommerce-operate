import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
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
import { OrderCollectDataSource } from './order-collect-data-source';
import { OrderCollectDetailComponent } from '../order-collect-detail/order-collect-detail.component';

@Component({
    selector: 'app-order-collect-list',
    templateUrl: './order-collect-list.component.html',
})

export class OrderCollectListComponent implements OnInit {
    selection = new SelectionModel<OrderDto>(true, []);
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "code",
            name: "mã phiếu",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },

        {
            id: "exportReceiptCode",
            name: "mã đơn giao hàng",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "customer",
            name: "khách hàng",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "department",
            name: "bộ phận",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "serviceCode",
            name: "mã dịch vụ",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdDate",
            name: "khoảng ngày thanh toán",
            type: "dateRange",
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
    displayedColumns: string[] = ['numericalOrder', 'code', 'orderDeliverCode', 'orderCode', 'customer', 'serviceCode', 'department', 'payDate', 'action'];

    dataSource!: OrderCollectDataSource;

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
        this.dataSource = new OrderCollectDataSource(this.mappingModels, this.orderService);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["customer"]) queryParams.customer = this.activeRoute.snapshot.queryParams["customer"];
        if (this.activeRoute.snapshot.queryParams["serviceCode"]) queryParams.serviceCode = this.activeRoute.snapshot.queryParams["serviceCode"];
        if (this.activeRoute.snapshot.queryParams["exportReceiptCode"]) queryParams.exportReceiptCode = this.activeRoute.snapshot.queryParams["exportReceiptCode"];
        if (this.activeRoute.snapshot.queryParams["department"]) queryParams.department = this.activeRoute.snapshot.queryParams["department"];

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

    openDetail(element: any) {
        this.router.navigateByUrl(`/sbb/order-collects/${element.id}`)
    }

    refresh() {
        this.loadPage();
        this.confirmDelivery = false;
        this.addDelivery = true;
    }

    print(element: any) {
        this.printService.printOrderCollect(element.id);
        this.orderService.requeueOrderReceiptPickups(element.id).subscribe((res: any) => {
            this.alertService.showToastSuccess();
        });
    }
}