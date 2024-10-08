import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ShopProductDataSource } from './shop-product-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { TranslateService } from '@ngx-translate/core';

import { BrandService } from 'src/app/services/brand.service';
import { ShopService } from 'src/app/services/shop.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { UpdateProductPriceComponent } from '../../product/update-product-price/update-product-price.component';

@Component({
    selector: 'app-shop-product-list',
    templateUrl: './shop-product-list.component.html',
})

export class ShopProductListComponent implements OnInit {
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
            id: "active",
            name: "trạng thái hoạt động",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: "true", name: 'hoạt động', isSelected: false },
                { index: 2, id: "false", name: 'không hoạt động', isSelected: false },
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

    displayedColumns: string[] = ['orderNumber', 'image', 'name',  'category', 'brand', 'price', 'cost', 'language', 'status', 'action'];

    dataSource!: ShopProductDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private AuthService: AuthService,
        private productService: ProductService,
        private brandService: BrandService,
        private shopService: ShopService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private mappingModels: MappingModels,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new ShopProductDataSource(this.productService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.initFilterCategoryOptions();
        this.initFilterBrandOptions();
        this.initFilterShopOptions();
    }

    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.params['id'];
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams = {
            id: this.activeRoute.snapshot.queryParams["id"],
            sku: this.activeRoute.snapshot.queryParams["sku"],
            shopId: this.id,
            categoryId: this.activeRoute.snapshot.queryParams["categoryId"],
            brandId: this.activeRoute.snapshot.queryParams["brandId"],
            name: this.activeRoute.snapshot.queryParams["name"],
            active: this.activeRoute.snapshot.queryParams["active"],
            price: this.activeRoute.snapshot.queryParams["price"],
        } as any;

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

    openDetail(element: any) {
        this.router.navigateByUrl(`sbb/products/${element.id}`);
    }

    updateProductPrice(element: any){
        const dialogRef = this.dialog.open(UpdateProductPriceComponent, {
            data: { id: element.id, name: element.name, price: element.maxPrice },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    setActiveProduct(element: any) {
        this.productService.activeProduct(element.id).subscribe(() => {
            this.alertService.success(`Sản phẩm ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setDisableProduct(element: any) {
        this.productService.disableProduct(element.id).subscribe(() => {
            this.alertService.success(`Sản phẩm ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

}