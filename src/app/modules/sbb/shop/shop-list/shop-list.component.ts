import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ShopDataSource } from './shop-data-source';
import { ShopService } from 'src/app/services/shop.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
    selector: 'app-shop-list',
    templateUrl: './shop-list.component.html',
})

export class ShopListComponent implements OnInit {
    id: any = '';
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
            id: "email",
            name: "email",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "phoneNumber",
            name: "số điện thoại",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "country",
            name: "quốc gia",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "active",
            name: "trạng thái",
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

    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'email', 'phoneNumber', 'country', 'address', 'description', 'autoApprove', 'status', 'action'];

    dataSource!: ShopDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private mappingModels: MappingModels,
        private shopService: ShopService,
        private dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService) {
        this.dataSource = new ShopDataSource(this.shopService, this.mappingModels);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["id"]) queryParams.id = this.activeRoute.snapshot.queryParams["id"];
        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["phoneNumber"]) queryParams.phoneNumber = this.activeRoute.snapshot.queryParams["phoneNumber"];
        if (this.activeRoute.snapshot.queryParams["email"]) queryParams.email = this.activeRoute.snapshot.queryParams["email"];
        if (this.activeRoute.snapshot.queryParams["autoApprove"]) queryParams.autoApprove = this.activeRoute.snapshot.queryParams["autoApprove"];
        if (this.activeRoute.snapshot.queryParams["active"]) queryParams.active = this.activeRoute.snapshot.queryParams["active"];

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

    addShop() {
        this.router.navigateByUrl('/sbb/create-shop');
    }

    openEdit(element: any) {
        this.router.navigateByUrl(`/sbb/shops/${element.id}/update`);
    }

    setActive(element: any) {
        this.shopService.setActive(element.id).subscribe(() => {
            this.alertService.success(`Nhà cung cấp ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setDisable(element: any) {
        this.shopService.setDisable(element.id).subscribe(() => {
            this.alertService.success(`Nhà cung cấp ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    openDetail(element: any){
        this.router.navigateByUrl(`/sbb/shops/${element.id}`);
    }

}