import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ShopOrderTransferDataSource } from './shop-order-transfer-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { OrderService } from 'src/app/services/order.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OrderDto } from 'src/app/shared/models/order/orderDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ShopService } from 'src/app/services/shop.service';
import { ConfirmOrderComponent } from '../../order/confirm-order/confirm-order.component';
import { DateService } from 'src/app/shared/date.service';
import { ConfirmOrderCompletedComponent } from '../../order/confirm-order-completed/confirm-order-completed.component';
import { TransporterService } from 'src/app/services/transporter.service';

@Component({
    selector: 'app-shop-order-transfer-list',
    templateUrl: './shop-order-transfer-list.component.html',
})

export class ShopOrderTransferListComponent implements OnInit {
    selection = new SelectionModel<OrderDto>(true, []);
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
            name: "mã đơn",
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
            id: "transporterId",
            name: "nhà vận chuyển",
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
                { index: 1, id: "1", name: 'đang tạo', isSelected: false },
                { index: 2, id: "2", name: 'chờ nhập', isSelected: false },
                { index: 3, id: "3", name: 'đang nhập', isSelected: false },
                { index: 4, id: "4", name: 'đã quyết toán', isSelected: false },
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
    displayedColumns: string[] = ['numericalOrder', 'code', 'transporter', 'orderNumber', 'quantity',
        'discount', 'totalPrice', 'totalImportedPrice', 'processStatus', 'quantityStatus', 'note', 'createdDate', 'action'];

    dataSource!: ShopOrderTransferDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private dateService: DateService,
        private shopService: ShopService,
        private transporterService: TransporterService,
        private orderService: OrderService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        this.dataSource = new ShopOrderTransferDataSource(this.mappingModels, this.orderService);
    }

    ngAfterViewInit() {
        this.initFilterShopOptions();
        this.initFilterTransporterOptions();
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
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["status"]) queryParams.status = this.activeRoute.snapshot.queryParams["status"];
        if (this.activeRoute.snapshot.queryParams["transporterId"]) queryParams.transporterId = this.activeRoute.snapshot.queryParams["transporterId"];
        if (this.activeRoute.snapshot.queryParams["productSku"]) queryParams.productSku = this.activeRoute.snapshot.queryParams["productSku"];

        queryParams.shopId = this.id;

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

    initFilterTransporterOptions() {
        this.transporterService.getTransporters({} as any, 0, 10000).subscribe((pageData) => {
            let options = pageData;
            this.allOptions.map(o => {
                if (o.id === 'transporterId') {
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
        this.router.navigateByUrl(`/sbb/order-transfers/${element.id}`)
    }

    addOrderEnter(item: any) {
        this.router.navigate([`/sbb/create-order-enter`], { queryParams: { orderId: item.id } });
    }

    updateCompleted(item: any) {
        const dialogRef = this.dialog.open(ConfirmOrderCompletedComponent, {
            data: [item],
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
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
}