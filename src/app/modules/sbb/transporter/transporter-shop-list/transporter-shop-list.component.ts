import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { TransporterShopDataSource } from './transporter-shop-data-source';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';
import { ShopService } from 'src/app/services/shop.service';
import { TransporterService } from 'src/app/services/transporter.service';

@Component({
    selector: 'app-transporter-shop-list',
    templateUrl: './transporter-shop-list.component.html',
})

export class TransporterShopListComponent implements OnInit {
    @Input() data!: any[];

    id = '';
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "name",
            name: "tên nhà cung cấp",
            type: "text",
            values: "",
            viewValues: "",
            isSelected: false
        },
        // {
        //     id: "code",
        //     name: "mã nhà cung cấp",
        //     type: "text",
        //     values: "",
        //     viewValues: "",
        //     isSelected: false
        // },
        {
            id: "phoneNumber",
            name: "số điện thoại",
            type: "text",
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

    displayedColumns: string[] = ['numericalOrder', '1', '2', '3', '4', '5'];

    dataSource!: TransporterShopDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private transporterService: TransporterService,
        private shopService: ShopService,
        private dateService: DateService,
        private mappingModels: MappingModels,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService) {
        this.dataSource = new TransporterShopDataSource(this.transporterService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.initFilterShopOptions();
    }

    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.params['id'];
        this.dataSource.loadData(this.id, this.getQueryParams());
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

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["phoneNumber"]) queryParams.phoneNumber = this.activeRoute.snapshot.queryParams["phoneNumber"];
        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["email"]) queryParams.email = this.activeRoute.snapshot.queryParams["email"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];

        return queryParams;
    }

    updateSearch(event: any) {
        this.dataSource.loadData(this.id, this.getQueryParams());
    }

    loadPage() {
        this.dataSource.loadData(
            this.id,
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

    remove(element: any) {

    }

}