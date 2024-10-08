import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { MoneyAccountDataSource } from './money-statistic-data-source';
import { CreateMoneyAccountComponent } from '../create-money-account/create-money-account.component';
import { environment } from 'src/environments/environment';
import { EditMoneyAccountComponent } from '../edit-money-account/edit-money-account.component';
import { AccountantService } from 'src/app/services/accountant.service';
import { DateService } from 'src/app/shared/date.service';
import { MoneyTransactionDetailComponent } from '../money-transaction-detail/money-transaction-detail.component';
import { PrintService } from 'src/app/services/print.service';

@Component({
    selector: 'app-money-statistic-list',
    templateUrl: './money-statistic-list.component.html',
})

export class MoneyStatisticListComponent implements OnInit {
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
            id: "moneyAccountId",
            name: "tài khoản tiền",
            type: "option",
            select: "many",
            options: [
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "accountTypeId",
            name: "loại tài khoản",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: 1, name: 'tiền mặt', isSelected: false },
                { index: 2, id: 2, name: 'tài khoản ngân hàng', isSelected: false },
                { index: 3, id: 3, name: 'ví điện tử', isSelected: false },
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

    displayedColumns: string[] = ['numbericalOrder', 'code', 'accountName', 'category', 'currency', 'before', 'collect', 'pay', 'after', 'reason', 'createdDate', 'action'];

    dataSource!: MoneyAccountDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private accountantService: AccountantService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private dateService: DateService,
        private printService: PrintService,
        private alertService: AlertService) {
        this.dataSource = new MoneyAccountDataSource(this.accountantService);
    }

    ngAfterViewInit() {
        this.initFilterMoneyAccountOptions();
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
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

    getQueryParams() {
        let queryParams: any = {};

        if (this.route.snapshot.queryParams["createdDate"]) {
            let createdDate = this.route.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryDates(queryParams, createdDate)
        }

        if (this.route.snapshot.queryParams["moneyAccountId"]) queryParams.moneyAccountId = this.route.snapshot.queryParams["moneyAccountId"];
        if (this.route.snapshot.queryParams["accountTypeId"]) queryParams.currencyTypeId = this.route.snapshot.queryParams["accountTypeId"];

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

    addMoneyAccount() {
        const dialogRef = this.dialog.open(CreateMoneyAccountComponent, {
            data: {
            },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    openUpdateDialog(element: any) {
        const dialogRef = this.dialog.open(EditMoneyAccountComponent, {
            data: {
                name: element.name,
                code: element.code,
                categoryId: 1,
                currencyId: 1,
                description: "Tài khoản tiền mặt"
            },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    openDetail(element: any): void {
        const dialogRef = this.dialog.open(MoneyTransactionDetailComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    print(element: any) {
        switch (element.categoryTypeId) {
            case 1:
                this.printService.printMoneyCollect(element.categoryId);
                break;

            case 2:
                this.printService.printMoneyPay(element.categoryId);
                break;

            case 3:
                break;

            case 4:
                break;
        }
    }


}