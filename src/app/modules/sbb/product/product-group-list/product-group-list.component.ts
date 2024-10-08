import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
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
import { ProductGroupDataSource } from './product-group-data-source';

@Component({
    selector: 'app-product-group-list',
    templateUrl: './product-group-list.component.html',
})

export class ProductGroupListComponent implements OnInit {
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
            name: "tên nhóm sản phẩm",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "code",
            name: "mã",
            type: "text",
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
            id: "visible",
            name: "trạng thái hiển thị",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: true, name: 'hiển thị', isSelected: false },
                { index: 2, id: false, name: 'không hiển thị', isSelected: false },
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
    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'description', 'visible', 'action'];

    dataSource!: ProductGroupDataSource;

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
        private authService: AuthService,
        private alertService: AlertService) {
        this.dataSource = new ProductGroupDataSource(this.productService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.permissions = this.authService.permissions;
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["description"]) queryParams.description = this.activeRoute.snapshot.queryParams["description"];
        if (this.activeRoute.snapshot.queryParams["visible"]) queryParams.visible = this.activeRoute.snapshot.queryParams["visible"];

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

    setInvisible(element: any) {
        this.productService.invisibleProductGroup(element.id).subscribe(() => {
            this.alertService.success(`Nhóm sản phẩm ${element.name} ở trạng thái không hiển thị`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setVisible(element: any) {
        this.productService.visibleProductGroup(element.id).subscribe(() => {
            this.alertService.success(`Nhóm sản phẩm ${element.name} ở trạng thái hiển thị`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    add() {
        this.router.navigateByUrl('/sbb/create-product-group');
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