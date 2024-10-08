import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { TranslateService } from '@ngx-translate/core';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';
import { ProductCategoryDataSource } from './product-category-data-source';

@Component({
    selector: 'app-product-category-list',
    templateUrl: './product-category-list.component.html',
})

export class ProductCategoryListComponent implements OnInit {
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "name",
            name: "tên danh mục",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "code",
            name: "mã danh mục",
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
            id: "isActive",
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
    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'description', 'status', 'action'];

    dataSource!: ProductCategoryDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private productService: ProductService,
        private dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private dateService: DateService,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        this.dataSource = new ProductCategoryDataSource(this.productService, this.mappingModels);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["description"]) queryParams.description = this.activeRoute.snapshot.queryParams["description"];
        if (this.activeRoute.snapshot.queryParams["isActive"]) queryParams.isActive = this.activeRoute.snapshot.queryParams["isActive"]

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
        console.log("page", e);

        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.loadPage();
    }

    setActive(element: any) {
        this.productService.activeProductCategory(element.id).subscribe(() => {
            this.alertService.success(`Danh mục ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setInactive(element: any) {
        this.productService.inactiveProductCategory(element.id).subscribe(() => {
            this.alertService.success(`Danh mục ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    add() {
        this.router.navigateByUrl('/sbb/create-product-category');
    }

    openDetail(element: any) {
        this.router.navigateByUrl(`/sbb/product-categories/${element.id}`);
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

    update(element: any) {
        this.router.navigateByUrl(`sbb/product-categories/${element.id}/update`)
    }

}