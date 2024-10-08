import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { ShopService } from 'src/app/services/shop.service';

import { CreateMoneyAccountComponent } from '../create-money-account/create-money-account.component';
import { environment } from 'src/environments/environment';
import { MoneyAccountDetailComponent } from '../money-account-detail/money-account-detail.component';
import { EditMoneyAccountComponent } from '../edit-money-account/edit-money-account.component';
import { FundReleaseDataSource } from './fund-release-data-source';
import { CreateFundReleaseComponent } from '../create-fund-release/create-fund-release.component';
import { AccountantService } from 'src/app/services/accountant.service';
import { FundReleaseDetailComponent } from '../fund-release-detail/fund-release-detail.component';
import { DateService } from 'src/app/shared/date.service';

@Component({
    selector: 'app-fund-release-list',
    templateUrl: './fund-release-list.component.html',
})

export class FundReleaseListComponent implements OnInit {
    currentUser!: any;
    currentUserSubscription!: Subscription;
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "billCode",
            name: "mã phiếu",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "moneyAccountId",
            name: "tài khoản",
            type: "option",
            select: "many",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "description",
            name: "ghi chú",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdDate",
            name: "khoảng ngày lập phiếu",
            type: "dateRange",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdBy",
            name: "người lập phiếu",
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

    displayedColumns: string[] = ['numbericalOrder', 'billCode', 'moneyAccount', 'totalMoney', 'description', 'createdDate', 'createdBy', 'action'];

    dataSource!: FundReleaseDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private accountantService: AccountantService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private dateService: DateService,
        private alertService: AlertService) {
        // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
        //   this.currentUser = user;
        // });
        this.dataSource = new FundReleaseDataSource(this.accountantService);
    }

    ngAfterViewInit() {
        this.initFilterMoneyAccountOptions();
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};
        queryParams.fundTypeId = 4; // xuất quỹ

        if (this.route.snapshot.queryParams["createdDate"]) {
            let createdDate = this.route.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryDates(queryParams, createdDate)
        }

        if (this.route.snapshot.queryParams["billCode"]) queryParams.billCode = this.route.snapshot.queryParams["billCode"];
        if (this.route.snapshot.queryParams["moneyAccountId"]) queryParams.moneyAccountId = this.route.snapshot.queryParams["moneyAccountId"];
        if (this.route.snapshot.queryParams["description"]) queryParams.description = this.route.snapshot.queryParams["description"];
        if (this.route.snapshot.queryParams["createdDate"]) queryParams.createdDate = this.route.snapshot.queryParams["createdDate"];
        if (this.route.snapshot.queryParams["createdBy"]) queryParams.createdBy = this.route.snapshot.queryParams["createdBy"];

        return queryParams;
    }

    initFilterMoneyAccountOptions() {
        let params: any = {};
        this.accountantService.getMoneyAccounts(params, 0, 10000).subscribe((data) => {
            let options = data;
            this.allOptions.map(o => {
                if (o.id === 'moneyAccountId') {
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

    add() {
        const dialogRef = this.dialog.open(CreateFundReleaseComponent, {
            data: {
            },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    openRemoveDialog(element: any) {

    }

    openDetail(element: any) {
        const dialogRef = this.dialog.open(FundReleaseDetailComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                //this.loadPage();
            }, environment.loadTimeout);
        });
    }

}