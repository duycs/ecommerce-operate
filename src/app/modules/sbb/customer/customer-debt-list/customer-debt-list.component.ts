import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { CustomerDebtDataSource } from './customer-debt-data-source';
import { CustomerService } from 'src/app/services/customer.service';
import { DateService } from 'src/app/shared/date.service';
import { MoneyDebtDetailComponent } from '../../money/money-debt-detail/money-debt-detail.component';
import { environment } from 'src/environments/environment';
import { CustomerDebtDetailComponent } from '../customer-debt-detail/customer-debt-detail.component';

@Component({
    selector: 'app-customer-debt-list',
    templateUrl: './customer-debt-list.component.html',
})

export class CustomerDebtListComponent implements OnInit {
    currentUser!: any;
    customerId!: any;
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    @Input() customer: any;
    
    allOptions: any[] = [
        {
            id: "createdDate",
            name: "thời gian biến động",
            type: "dateRange",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "description",
            name: "nội dung",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "debtAmountType",
            name: "biến động",
            type: "option",
            select: "many",
            options: [
                { index: 1, id: "up", name: 'tăng', isSelected: false },
                { index: 2, id: "down", name: 'giảm', isSelected: false },
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

    displayedColumns: string[] = ['numericalOrder', 'createDate', 'content', 'beforeDebt', 'upMoney', 'downMoney', 'lastDebt', 'action'];

    dataSource!: CustomerDebtDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private dateService: DateService,
        private customerService: CustomerService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService) {
        this.dataSource = new CustomerDebtDataSource(this.customerService);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.customerId = this.activeRoute.snapshot.params['id'];
        this.dataSource.loadData(this.customerId, this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};
        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["description"]) queryParams.description = this.activeRoute.snapshot.queryParams["description"];
        if (this.activeRoute.snapshot.queryParams["debtAmountType"]) queryParams.debtAmountType = this.activeRoute.snapshot.queryParams["debtAmountType"];

        return queryParams;
    }

    updateSearch(event: any) {
        this.dataSource.loadData(this.customerId, this.getQueryParams());
    }

    loadPage() {
        this.dataSource.loadData(
            this.customerId,
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

    openDetail(element: any): void {
        const dialogRef = this.dialog.open(CustomerDebtDetailComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

}