import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';
import { MoneyPayDataSource } from './money-pay-data-source';
import { CreateMoneyPayComponent } from '../create-money-pay/create-money-pay.component';
import { MoneyPayDetailComponent } from '../money-pay-detail/money-pay-detail.component';
import { AccountantService } from 'src/app/services/accountant.service';
import { DateService } from 'src/app/shared/date.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
    selector: 'app-money-pay-list',
    templateUrl: './money-pay-list.component.html',
})

export class MoneyPayListComponent implements OnInit {
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
            name: "tài khoản tiền",
            type: "option",
            select: "many",
            options: [
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        // {
        //     id: "currencyTypeId",
        //     name: "đơn vị tiền tệ",
        //     type: "option",
        //     select: "many",
        //     options: [
        //         { index: 1, id: "1", name: 'VND', isSelected: false },
        //         { index: 2, id: "2", name: 'CYN', isSelected: false },
        //     ],
        //     values: "",
        //     viewValues: "",
        //     isSelected: false
        // },
        {
            id: "objectTypeId",
            name: "đối tượng",
            type: "option",
            select: "many",
            options: [
                { index: 1, id: 1, name: 'khách hàng', isSelected: false },
                { index: 2, id: 2, name: 'nhà cung cấp', isSelected: false },
                { index: 3, id: 3, name: 'nhà vận chuyển', isSelected: false },
                { index: 4, id: 4, name: 'nhân viên', isSelected: false },
                { index: 5, id: 5, name: 'hệ thống', isSelected: false },
                { index: 5, id: 5, name: 'khác', isSelected: false },
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdBy",
            name: "người tạo",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "billTypeId",
            name: "chứng từ",
            type: "option",
            select: "many",
            options: [
                { index: 1, id: 1, name: 'đơn bán buôn', isSelected: false },
                { index: 2, id: 2, name: 'đơn bán lẻ', isSelected: false },
                { index: 3, id: 3, name: 'đơn nhà cung cấp', isSelected: false },
            ],
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

    displayedColumns: string[] = ['numbericalOrder', 'code', 'moneyAccount', 'currency', 'customer', 'creator', 'order', 'reason', 'explain', 'money', 'createdDate', 'action'];

    dataSource!: MoneyPayDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private accountantService: AccountantService,
        private printService: PrintService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private dateService: DateService,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new MoneyPayDataSource(this.accountantService);
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

        queryParams.ledgerTypeId = 2; // phiếu chi

        if (this.route.snapshot.queryParams["createdDate"]) {
            let createdDate = this.route.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.route.snapshot.queryParams["moneyAccountId"]) queryParams.moneyAccountId = this.route.snapshot.queryParams["moneyAccountId"];
        if (this.route.snapshot.queryParams["currencyTypeId"]) queryParams.currencyTypeId = this.route.snapshot.queryParams["currencyTypeId"];
        if (this.route.snapshot.queryParams["billCode"]) queryParams.billCode = this.route.snapshot.queryParams["billCode"];
        if (this.route.snapshot.queryParams["objectTypeId"]) queryParams.objectTypeId = this.route.snapshot.queryParams["objectTypeId"];
        if (this.route.snapshot.queryParams["title"]) queryParams.title = this.route.snapshot.queryParams["title"];
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

    addMoneyPay() {
        const dialogRef = this.dialog.open(CreateMoneyPayComponent, {
            data: {
            },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    getTotalCost() {
        // return this.dataSource.map(t => t.cost).reduce((acc, value) => acc + value, 0);
        return 0;
    }

    openUpdateDialog(element: any) {

    }

    openRemoveDialog(element: any) {

    }

    openDetail(element: any) {
        const dialogRef = this.dialog.open(MoneyPayDetailComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                //this.loadPage();
            }, environment.loadTimeout);
        });
    }

    print(element: any) {
        this.printService.printMoneyPay(element.id);
    }

}