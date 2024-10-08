import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ProductOrderDataSource } from './product-order-statistic-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { CreateProductComponent } from '../create-product/create-product.component';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { TranslateService } from '@ngx-translate/core';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

import { BrandService } from 'src/app/services/brand.service';
import { ShopService } from 'src/app/services/shop.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';

@Component({
    selector: 'app-product-order-statistic-list',
    templateUrl: './product-order-statistic-list.component.html',
})

export class ProductOrderStatisticListComponent implements OnInit {
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
            id: "name",
            name: "tên sản phẩm",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "sku",
            name: "sku",
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
            select: "many",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "brandId",
            name: "thương hiệu",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "statusId",
            name: "trạng thái trên đơn",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: "1", name: 'đang xử lý', isSelected: false },
                { index: 2, id: "2", name: 'kết thúc đặt hàng', isSelected: false },
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

    title: string = "";
    quantityColName: string = "Số lượng";
    displayedColumns: string[] = ['orderNumber', 'image', 'name', 'shop', 'category', 'brand', 'quantity', 'status', 'action'];

    dataSource!: ProductOrderDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private productService: ProductService,
        private brandService: BrandService,
        private shopService: ShopService,
        private dialog: MatDialog,
        private dateService: DateService,
        private activeRoute: ActivatedRoute,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
        //   this.currentUser = user;
        // });
        this.dataSource = new ProductOrderDataSource(this.productService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.initFilterCategoryOptions();
        this.initFilterBrandOptions();
        this.initFilterShopOptions();
    }

    ngOnInit(): void {
        let queryParams = this.getQueryParams();
        this.dataSource.loadData(queryParams);

        if (queryParams.count === 'productOrder') {
            this.title = 'Tra cứu đặt hàng Nhà cung cấp';
            this.quantityColName = 'Số lượng đặt hàng';
        } else if (queryParams.count === 'productEnter') {
            this.title = 'Tra cứu nhập hàng Nhà cung cấp';
            this.quantityColName = 'Số lượng nhập hàng';
        }
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["sku"]) queryParams.sku = this.activeRoute.snapshot.queryParams["sku"];
        if (this.activeRoute.snapshot.queryParams["shopId"]) queryParams.shopId = this.activeRoute.snapshot.queryParams["shopId"];
        if (this.activeRoute.snapshot.queryParams["categoryId"]) queryParams.categoryId = this.activeRoute.snapshot.queryParams["categoryId"]
        if (this.activeRoute.snapshot.queryParams["brandId"]) queryParams.brandId = this.activeRoute.snapshot.queryParams["brandId"]
        if (this.activeRoute.snapshot.queryParams["statusId"]) queryParams.statusId = this.activeRoute.snapshot.queryParams["statusId"]

        return queryParams;
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

    initFilterBrandOptions() {
        this.brandService.getBrands(0, 10000).subscribe((pageData) => {
            let options = pageData.data;
            this.allOptions.map(o => {
                if (o.id === 'brandId') {
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

    openAddDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.height = '100%';
        dialogConfig.width = '100%';

        const dialogRef = this.dialog.open(CreateProductComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            result => {
                setTimeout(() => {
                    console.log("reload after added", result);
                    this.loadPage();
                }, environment.loadTimeout);
            }
        );
    }

    openDetailDialog(element: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = element;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.height = '100%';
        dialogConfig.width = '100%';

        const dialogRef = this.dialog.open(ProductDetailComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            result => {
            }
        );
    }

    openUpdateDialog(element: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = element;

        const dialogRef = this.dialog.open(UpdateProductComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            result => {
                setTimeout(() => {
                    console.log("reload after added", result);
                    this.loadPage();
                }, environment.loadTimeout);
            }
        );
    }

    openRemoveDialog(element: any): void {
        const dialogRef = this.dialog.open(DeleteProductComponent, {
            data: { id: element.id, name: element.name },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

}