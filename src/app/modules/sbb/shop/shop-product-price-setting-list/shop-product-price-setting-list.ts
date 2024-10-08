import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { DateService } from 'src/app/shared/date.service';
import { PrintService } from 'src/app/services/print.service';
import { TemplateService } from 'src/app/services/template.service';
import { ShopProductPriceSettingDataSource } from './shop-product-price-setting-data-source';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
    selector: 'app-shop-product-price-setting-list',
    templateUrl: './shop-product-price-setting-list.html',
})

export class ShopProductPriceSettingListComponent implements OnInit {
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "shopId",
            name: "nhà cung cấp",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "lastUpdatedDate",
            name: "khoảng ngày cập nhật",
            type: "dateRange",
            select: "",
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
        {
            id: "enable",
            name: "trạng thái kích hoạt",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: true, name: 'kích hoạt', isSelected: false },
                { index: 2, id: false, name: 'chưa kích hoạt', isSelected: false },
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

    displayedColumns: string[] = ['numbericalOrder', 'shop', 'setupRatio', 'createdBy', 'createdDate', 'description', 'enable', 'status', 'action'];

    dataSource!: ShopProductPriceSettingDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Input() showHeader = true;

    constructor(
        private translateService: TranslateService,
        private templateService: TemplateService,
        private productService: ProductService,
        private shopService: ShopService,
        private printService: PrintService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private dateService: DateService,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new ShopProductPriceSettingDataSource(this.templateService, this.productService);
    }

    ngAfterViewInit() {
        this.initFilterShopOptions();
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }


    getQueryParams() {
        let queryParams: any = {};

        if (this.route.snapshot.queryParams["lastUpdatedDate"]) {
            let lastUpdatedDate = this.route.snapshot.queryParams["lastUpdatedDate"];
            queryParams = this.dateService.getQueryLastUpdatedDates(queryParams, lastUpdatedDate)
        }

        if (this.route.snapshot.queryParams["shopId"]) queryParams.shopId = this.route.snapshot.queryParams["shopId"];
        if (this.route.snapshot.queryParams["description"]) queryParams.description = this.route.snapshot.queryParams["description"];

        return queryParams;
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
        this.router.navigateByUrl("/sbb/create-shop-product-price-setting");
    }

    update(element: any) {
        if (element.settings) {
            this.router.navigateByUrl(`/sbb/shop-product-price-settings/${element.id}/update`);
        } else {
            this.router.navigateByUrl(`/sbb/create-shop-product-price-setting?shopId=${element.shopId}`);
        }
    }

    remove(element: any) {
        this.templateService.removeShopSetting(element.id)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.loadPage();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    enable(element: any) {
        this.templateService.enableShopSetting(element.id)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.loadPage();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    disable(element: any) {
        this.templateService.diableShopSetting(element.id)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.loadPage();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    updateSalePrice(element: any) {
        let data: any = {
            ShopIds: [element.shopId],
            ProductIds: [] // update sale price for all product of shop
        };

        this.templateService.updateSalePrices(data)
            .subscribe((totalUpdated: any) => {
                this.alertService.showToastMessage(`Đã cập nhật giá cho ${totalUpdated} sản phẩm`);
                this.loadPage();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    openDetail(element: any) {
        if (element.settings) {
            this.router.navigateByUrl(`/sbb/shop-product-price-settings/${element.id}`);
        }
    }

}