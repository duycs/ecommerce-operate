import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ShopOrderDataSource } from './shop-order-data-source';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';
import { environment } from 'src/environments/environment';
import { ConfirmOrderComponent } from '../../order/confirm-order/confirm-order.component';
import { PrintService } from 'src/app/services/print.service';
import { ConfirmOrderCompletedComponent } from '../../order/confirm-order-completed/confirm-order-completed.component';

@Component({
    selector: 'app-shop-order-list',
    templateUrl: './shop-order-list.component.html',
})

export class ShopOrderListComponent implements OnInit {
    id = '';
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
            id: "note",
            name: "ghi chú",
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
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numericalOrder', 'code', 'subCode', 'customer', 'staff', 'quantityOrder', 'quantityDelivery', 'cashDiscount', 'price', 'processStatus', 'orderDate', 'action'];

    dataSource!: ShopOrderDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private router: Router,
        private dateService: DateService,
        private orderService: OrderService,
        private mappingModels: MappingModels,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private printService: PrintService,
        private alertService: AlertService) {
        this.dataSource = new ShopOrderDataSource(this.orderService, this.mappingModels);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.params['id'];
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["note"]) queryParams.note = this.activeRoute.snapshot.queryParams["note"];
        if (this.activeRoute.snapshot.queryParams["customerId"]) queryParams.customerId = this.activeRoute.snapshot.queryParams["customerId"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["status"]) queryParams.status = this.activeRoute.snapshot.queryParams["status"];

        queryParams.shopId = this.id;

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
        this.router.navigateByUrl(`/sbb/order-subs/${element.id}`)
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