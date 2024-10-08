import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { TranslateService } from '@ngx-translate/core';

import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ProductPriceDataSource } from './product-price-data-source';
import { DateService } from 'src/app/shared/date.service';
import { UpdateProductPriceComponent } from '../update-product-price/update-product-price.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-product-price-list',
    templateUrl: './product-price-list.component.html',
})

export class ProductPriceListComponent implements OnInit {
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
            id: "createdDate",
            name: "khoảng ngày tạo",
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
            id: "creatorId",
            name: "người thiết lập",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "note",
            name: "ghi chú",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "productId",
            name: "sản phẩm",
            type: "option",
            select: "one",
            options: [],
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

    title: string = "Product";
    displayedColumns: string[] = ['orderNumber', 'code', 'product', 'creator', 'note', 'price', 'afterPrice', 'status', 'dateCreate', 'action'];

    dataSource!: ProductPriceDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private productService: ProductService,
        private dateService: DateService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
        //   this.currentUser = user;
        // });
        this.dataSource = new ProductPriceDataSource(this.productService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.initFilterProductOptions();
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    initFilterProductOptions() {
        this.productService.getProducts({} as any, 1, 1000).subscribe((pageData) => {
            let options = pageData;
            this.allOptions.map(o => {
                if (o.id === 'productId') {
                    o.options = options;
                }
            });
        });
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["note"]) queryParams.note = this.activeRoute.snapshot.queryParams["note"];
        if (this.activeRoute.snapshot.queryParams["createdBy"]) queryParams.createdBy = this.activeRoute.snapshot.queryParams["createdBy"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["productId"]) queryParams.productId = this.activeRoute.snapshot.queryParams["productId"];

        return queryParams;
    }

    updateSearch(event: any) {
        this.dataSource.loadData(this.getQueryParams());
    }

    createPriceSetting() {
        this.router.navigateByUrl('/sbb/product-prices/update');
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

    updateProductPrice(element: any) {
        const dialogRef = this.dialog.open(UpdateProductPriceComponent, {
            data: { id: element.product.id, name: element.product.name, price: element.upPrice },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

}