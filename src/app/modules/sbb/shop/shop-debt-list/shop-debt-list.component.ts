import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ShopProductDataSource } from './shop-debt-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DeleteProductComponent } from '../../product/delete-product/delete-product.component';
import { AccountantService } from 'src/app/services/accountant.service';
import { DateService } from 'src/app/shared/date.service';
import { MoneyDebtDetailComponent } from '../../money/money-debt-detail/money-debt-detail.component';

@Component({
    selector: 'app-shop-debt-list',
    templateUrl: './shop-debt-list.component.html',
})

export class ShopDebtListComponent implements OnInit {
    id!: any;
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
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
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numbericalOrder', 'createDate', 'category', 'currency', 'beforeDebt', 'moneyStatus', 'afterDebt', 'action'];

    dataSource!: ShopProductDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private accountantService: AccountantService,
        private dateService: DateService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        this.dataSource = new ShopProductDataSource(this.accountantService, this.mappingModels);
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

        queryParams.objectTypeId = 2; // shop
        queryParams.objectId = this.id;

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

    openDetail(element: any): void {
        const dialogRef = this.dialog.open(MoneyDebtDetailComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

}