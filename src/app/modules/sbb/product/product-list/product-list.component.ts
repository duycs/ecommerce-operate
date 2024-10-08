import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ProductDataSource } from './product-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { CreateProductComponent } from '../create-product/create-product.component';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { TranslateService } from '@ngx-translate/core';
import { BrandService } from 'src/app/services/brand.service';
import { ShopService } from 'src/app/services/shop.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';
import { UpdateProductPriceComponent } from '../update-product-price/update-product-price.component';
import { CreateProductPriceSettingComponent } from '../create-product-price-setting/create-product-price-setting.component';
import { TemplateService } from 'src/app/services/template.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
})

export class ProductListComponent implements OnInit {
    permissions!: any[];
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
            id: "autoApprove",
            name: "duyệt tự động",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: "true", name: 'Có', isSelected: false },
                { index: 2, id: "false", name: 'Không', isSelected: false },
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "approve",
            name: "trạng thái phê duyệt",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: "true", name: 'đã duyệt', isSelected: false },
                { index: 2, id: "false", name: 'chưa duyệt', isSelected: false },
            ],
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

    title: string = "Product";
    displayedColumns: string[] = ['numbericalOrder', 'image', 'name', 'shop', 'category', 'brand', 'originPrice', 'autoProductPrice', 'newPrice', 'language', 'autoApprove', 'activeStatus', 'approveStatus', 'action'];

    dataSource!: ProductDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private templateService: TemplateService,
        private translateService: TranslateService,
        private productService: ProductService,
        private brandService: BrandService,
        private shopService: ShopService,
        private dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private dateService: DateService,
        private mappingModels: MappingModels,
        public authService: AuthService,
        private alertService: AlertService) {
        this.dataSource = new ProductDataSource(this.productService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.initFilterCategoryOptions();
        this.initFilterBrandOptions();
        this.initFilterShopOptions();
        this.permissions = this.authService.permissions;
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["sku"]) queryParams.sku = this.activeRoute.snapshot.queryParams["sku"];
        if (this.activeRoute.snapshot.queryParams["shopId"]) queryParams.shopId = this.activeRoute.snapshot.queryParams["shopId"];
        if (this.activeRoute.snapshot.queryParams["categoryId"]) queryParams.categoryId = this.activeRoute.snapshot.queryParams["categoryId"];
        if (this.activeRoute.snapshot.queryParams["brandId"]) queryParams.brandId = this.activeRoute.snapshot.queryParams["brandId"];
        if (this.activeRoute.snapshot.queryParams["approve"]) queryParams.approve = this.activeRoute.snapshot.queryParams["approve"];
        if (this.activeRoute.snapshot.queryParams["active"]) queryParams.active = this.activeRoute.snapshot.queryParams["active"];
        if (this.activeRoute.snapshot.queryParams["autoApprove"]) queryParams.autoApprove = this.activeRoute.snapshot.queryParams["autoApprove"];

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
        console.log("page", e);

        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.loadPage();
    }

    setActiveProduct(element: any) {
        this.productService.activeProduct(element.id).subscribe(() => {
            this.alertService.success(`Sản phẩm ${element.name} ở trạng thái phê duyệt`);
            //this.updateSalePriceBySettings(element);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setDisableProduct(element: any) {
        this.productService.disableProduct(element.id).subscribe(() => {
            this.alertService.success(`Sản phẩm ${element.name} ở trạng thái chưa duyệt`);
            //this.updateSalePriceZero(element.id);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
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

    openDetail(element: any) {
        this.router.navigateByUrl(`sbb/products/${element.id}`);
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

    updatePrice(element: any) {
        const dialogRef = this.dialog.open(UpdateProductPriceComponent, {
            data: { id: element.id, name: element.name, price: element.maxPrice },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    createPriceSetting(element: any) {
        const dialogRef = this.dialog.open(CreateProductPriceSettingComponent, {
            data: element
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    updateSalePriceBySettings(element: any) {
        let data: any = {
            ShopIds: [element.shopId],
            ProductIds: [element.id]
        };

        this.templateService.updateSalePrices(data)
            .subscribe((totalUpdated: any) => {
                if (totalUpdated > 0) {
                    this.alertService.showToastMessage(`Đã cập nhật giá cho sản phẩm ${element.name}`);
                }
                else if (totalUpdated == 0) {
                    this.alertService.showToastMessage(`Không có áp dụng cài đặt cập nhật giá cho sản phẩm ${element.name}`);
                }

                this.loadPage();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    updateSalePriceZero(productId: any) {
        let productPriceSettings: any = [
            {
                productId: productId,
                upPrice: 0,
                note: ''
            }];

        let data = {
            productPriceSettings: productPriceSettings
        };

        this.productService.createProductPriceSettings(data)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.loadPage();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });

    }

}