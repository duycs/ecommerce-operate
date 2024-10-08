import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { MoneyAccountDataSource } from './money-account-data-source';
import { CreateMoneyAccountComponent } from '../create-money-account/create-money-account.component';
import { environment } from 'src/environments/environment';
import { EditMoneyAccountComponent } from '../edit-money-account/edit-money-account.component';
import { AccountantService } from 'src/app/services/accountant.service';

@Component({
    selector: 'app-money-account-list',
    templateUrl: './money-account-list.component.html',
})

export class MoneyAccountListComponent implements OnInit {
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
            id: "name",
            name: "tên tài khoản",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "code",
            name: "mã tài khoản",
            type: "text",
            select: "",
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
        {
            id: "currencyId",
            name: "đơn vị tiền tệ",
            type: "option",
            select: "many",
            options: [
                { index: 1, id: "1", name: 'VND', isSelected: false },
                { index: 2, id: "2", name: 'CYN', isSelected: false },
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "description",
            name: "mô tả",
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

    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'accountType', 'currency', 'description', 'action'];

    dataSource!: MoneyAccountDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private accountantSerive: AccountantService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new MoneyAccountDataSource(this.accountantSerive);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {}
        if (this.route.snapshot.queryParams["id"]) queryParams.id = this.route.snapshot.queryParams["id"];

        if (this.route.snapshot.queryParams["name"]) queryParams.name = this.route.snapshot.queryParams["name"];

        if (this.route.snapshot.queryParams["code"]) queryParams.code = this.route.snapshot.queryParams["code"];

        if (this.route.snapshot.queryParams["currencyId"]) queryParams.currencyTypeId = this.route.snapshot.queryParams["currencyId"];

        if (this.route.snapshot.queryParams["accountTypeId"]) queryParams.currencyTypeId = this.route.snapshot.queryParams["accountTypeId"];

        if (this.route.snapshot.queryParams["description"]) queryParams.description = this.route.snapshot.queryParams["description"];

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
            data: element,
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
        this.router.navigateByUrl(`/sbb/money-accounts/${element.id}`);
    }

}