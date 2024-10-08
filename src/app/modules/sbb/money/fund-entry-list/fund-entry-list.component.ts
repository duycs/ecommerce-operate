import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { environment } from 'src/environments/environment';
import { FundEntryDataSource } from './fund-entry-data-source';
import { CreateFundEntryComponent } from '../create-fund-entry/create-fund-entry.component';
import { AccountantService } from 'src/app/services/accountant.service';
import { FundEntryDetailComponent } from '../fund-entry-detail/fund-entry-detail.component';
import { DateService } from 'src/app/shared/date.service';

@Component({
    selector: 'app-fund-entry-list',
    templateUrl: './fund-entry-list.component.html',
})

export class FundEntryListComponent implements OnInit {
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

    dataSource!: FundEntryDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private accountantService: AccountantService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private dateService: DateService,
        private alertService: AlertService) {
        this.dataSource = new FundEntryDataSource(this.accountantService);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};
        queryParams.fundTypeId = 3; // xuất quỹ

        
        if (this.route.snapshot.queryParams["createdDate"]) {
            let createdDate = this.route.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
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
        const dialogRef = this.dialog.open(CreateFundEntryComponent, {
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
        const dialogRef = this.dialog.open(FundEntryDetailComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                //this.loadPage();
            }, environment.loadTimeout);
        });
    }


}