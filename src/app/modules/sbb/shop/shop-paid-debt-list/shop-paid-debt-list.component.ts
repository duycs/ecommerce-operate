import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ShopService } from 'src/app/services/shop.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ShopPaidDebtDataSource } from './shop-paid-debt-data-source';
import { CreateShopPaidDebtComponent } from '../create-shop-paid-debt/create-shop-paid-debt.component';
import { ShopPaidDebtDetailComponent } from '../shop-paid-debt-detail/shop-paid-debt-detail.component';
import { DateService } from 'src/app/shared/date.service';
import { AccountantService } from 'src/app/services/accountant.service';

@Component({
    selector: 'app-shop-paid-debt-list',
    templateUrl: './shop-paid-debt-list.component.html',
})

export class ShopPaidDebtListComponent implements OnInit {
    id = '';
    shopDetail: any;
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;

    @Output() outUpdate: any = new EventEmitter;;

    allOptions: any[] = [
        {
            id: "createdDate",
            name: "khoảng thời gian biến động",
            type: "dateRange",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
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
            id: "moneyAccountId",
            name: "tài khoản tiền",
            type: "option",
            select: "one",
            values: [],
            viewValues: "",
            isSelected: false
        },
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numbericalOrder', 'createDate', 'code', 'creator', 'moneyAccount', 'currency', 'beforeDebt', 'moneyStatus', 'afterDebt', 'description', 'action'];

    dataSource!: ShopPaidDebtDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private dateService: DateService,
        private accountantService: AccountantService,
        private shopService: ShopService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        this.dataSource = new ShopPaidDebtDataSource(this.accountantService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.initFilterMoneyAccountOptions();
    }

    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.params['id'];
        this.dataSource.loadData(this.getQueryParams());
        this.getShop();
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

        queryParams.objectTypeId = 2; // shop
        queryParams.objectId = this.id;

        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["moneyAccountId"]) queryParams.moneyAccountId = this.activeRoute.snapshot.queryParams["moneyAccountId"];

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

    getShop() {
        this.shopService.getShop(this.id)
            .subscribe(res => {
                this.shopDetail = this.mappingModels.ToDisplayShopDto(res);
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.loadPage();
    }

    openDetail(element: any): void {
        console.log(element);
        const dialogRef = this.dialog.open(ShopPaidDebtDetailComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    addPaidDebt() {
        const dialogRef = this.dialog.open(CreateShopPaidDebtComponent, {
            data: { shop: this.shopDetail },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
                this.outUpdate.emit("added PaidDebt");
            }, environment.loadTimeout);
        });
    }
}