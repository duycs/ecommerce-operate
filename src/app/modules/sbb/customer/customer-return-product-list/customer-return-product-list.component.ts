import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomerReturnProductDataSource } from './customer-return-product-data-source';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';

@Component({
    selector: 'app-customer-return-product-list',
    templateUrl: './customer-return-product-list.component.html',
})

export class CustomerReturnProductListComponent implements OnInit {
    id!: any;
    @Input() statistic!: any;
    @Input() customer!: any;
    
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
        }
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numericalOrder', 'code', 'orderNumber', 'staff', 'quantity', 'price', 'status', 'action'];

    dataSource!: CustomerReturnProductDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private orderService: OrderService,
        private mappingModels: MappingModels,
        private dialog: MatDialog,
        private dateService: DateService,
        private activedRoute: ActivatedRoute,
        private alertService: AlertService) {
        this.dataSource = new CustomerReturnProductDataSource(this.orderService, this.mappingModels);
    }

    ngAfterViewInit() {
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


        if (this.activedRoute.snapshot.queryParams["createdDate"]) queryParams.createdDate = this.activedRoute.snapshot.queryParams["createdDate"];
        if (this.activedRoute.snapshot.queryParams["code"]) queryParams.code = this.activedRoute.snapshot.queryParams["code"];

        queryParams.status = 4;
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

    remove(element: any){

    }

}