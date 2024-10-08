import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { TransporterProductDataSource } from './transporter-product-data-source';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';
import { BrandService } from 'src/app/services/brand.service';
import { TransporterService } from 'src/app/services/transporter.service';

@Component({
    selector: 'app-transporter-product-list',
    templateUrl: './transporter-product-list.component.html',
})

export class TransporterProductListComponent implements OnInit {
    id = '';
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "productSku",
            name: "mã sản phẩm",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
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
            id: "categoryId",
            name: "danh mục",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        // {
        //     id: "brandId",
        //     name: "thương hiệu",
        //     type: "option",
        //     select: "one",
        //     options: [],
        //     values: "",
        //     viewValues: "",
        //     isSelected: false
        // },
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numericalOrder', 'image', 'name', 'shop', 'category', 'brand', 'quantity'];

    dataSource!: TransporterProductDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private dateService: DateService,
        private orderService: OrderService,
        private productService: ProductService,
        private mappingModels: MappingModels,
        private transporterService: TransporterService,
        private brandService: BrandService,
        private shopService: ShopService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService) {
        this.dataSource = new TransporterProductDataSource(this.transporterService, this.mappingModels);
    }

    ngAfterViewInit() {
        //this.initFilterBrandOptions();
        this.initFilterShopOptions();
        this.initFilterCategoryOptions();
    }

    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.params['id'];
        this.dataSource.loadData(this.id, this.getQueryParams());
    }

    initFilterCategoryOptions() {
        this.productService.getProductCategories(0, 10000).subscribe((pageData) => {
            let options = pageData.data;
            this.allOptions.map(o => {
                if (o.id === 'categoryId') {
                    o.options = options;
                }
            });
        });
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

    // initFilterBrandOptions() {
    //     this.brandService.getBrands({}, 0, 10000).subscribe((pageData) => {
    //         let options = pageData.data;
    //         this.allOptions.map(o => {
    //             if (o.id === 'brandId') {
    //                 o.options = options;
    //             }
    //         });
    //     });
    // }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["productName"]) queryParams.productName = this.activeRoute.snapshot.queryParams["productName"];
        if (this.activeRoute.snapshot.queryParams["productSku"]) queryParams.productSku = this.activeRoute.snapshot.queryParams["productSku"];
        if (this.activeRoute.snapshot.queryParams["productId"]) queryParams.productId = this.activeRoute.snapshot.queryParams["productId"];
        if (this.activeRoute.snapshot.queryParams["shopId"]) queryParams.shopId = this.activeRoute.snapshot.queryParams["shopId"];
        if (this.activeRoute.snapshot.queryParams["brandId"]) queryParams.brandId = this.activeRoute.snapshot.queryParams["brandId"];
        if (this.activeRoute.snapshot.queryParams["categoryId"]) queryParams.categoryId = this.activeRoute.snapshot.queryParams["categoryId"];

        queryParams.transporterId = this.id;

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

    openDetail(element: any){

    }

}