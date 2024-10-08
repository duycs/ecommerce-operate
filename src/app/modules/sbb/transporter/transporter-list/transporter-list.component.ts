import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { TransporterDataSource } from './transporter-data-source';
import { TransporterService } from 'src/app/services/transporter.service';

@Component({
    selector: 'app-transporter-list',
    templateUrl: './transporter-list.component.html',
})

export class TransporterListComponent implements OnInit {
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
            name: "tên nhà vận chuyển",
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
            id: "phoneNumber",
            name: "số điện thoại",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "status",
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
            id: "productSku",
            name: "mã sản phẩm đã chuyển",
            type: "text",
            select: "",
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

    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'phoneNumber', 'orderCount', 'productCodeDelivered', 'productDelivered', 'status', 'action'];

    dataSource!: TransporterDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private mappingModels: MappingModels,
        private transporterService: TransporterService,
        private dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService) {
        this.dataSource = new TransporterDataSource(this.transporterService, this.mappingModels);
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
        if (this.activeRoute.snapshot.queryParams["status"]) queryParams.status = this.activeRoute.snapshot.queryParams["status"];
        if (this.activeRoute.snapshot.queryParams["productSku"]) queryParams.productSku = this.activeRoute.snapshot.queryParams["productSku"];

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

    add() {
        this.router.navigateByUrl('/sbb/create-transporter');
    }

    openDetail(element: any) {
        this.router.navigateByUrl(`/sbb/transporters/${element.id}`);
    }

    openEdit(element: any) {
        this.router.navigateByUrl(`/sbb/transporters/${element.id}/update`);
    }

    setActive(element: any) {
        this.transporterService.setActive(element.id).subscribe(() => {
            this.alertService.success(`Nhà vận chuyển ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setDisable(element: any) {
        this.transporterService.setDisable(element.id).subscribe(() => {
            this.alertService.success(`Nhà vận chuyển ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

}