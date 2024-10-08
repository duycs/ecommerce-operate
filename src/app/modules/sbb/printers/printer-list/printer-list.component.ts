import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DateService } from 'src/app/shared/date.service';
import { DepartmentService } from 'src/app/services/department.service';
import { PrinterDataSource } from './printer-data-source';
import { CreatePrinterComponent } from '../create-printer/create-printer.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-printer-list',
    templateUrl: './printer-list.component.html',
})

export class PrinterListComponent implements OnInit {
    id: any = '';
    length = 50;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "name",
            name: "tên máy in",
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
            id: "active",
            name: "trạng thái",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: true, name: 'hoạt động', isSelected: false },
                { index: 2, id: false, name: 'không hoạt động', isSelected: false },
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

    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'description', 'status', 'createDate', 'action'];

    dataSource!: PrinterDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private mappingModels: MappingModels,
        private departmentService: DepartmentService,
        private dateService: DateService,
        private dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService) {
        this.dataSource = new PrinterDataSource(this.departmentService, this.mappingModels);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["id"]) queryParams.id = this.activeRoute.snapshot.queryParams["id"];
        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["active"]) queryParams.active = this.activeRoute.snapshot.queryParams["active"];
        if (this.activeRoute.snapshot.queryParams["description"]) queryParams.description = this.activeRoute.snapshot.queryParams["description"];

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
        const dialogRef = this.dialog.open(CreatePrinterComponent, {
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    openEdit(element: any) {
        this.router.navigateByUrl(`/sbb/assets/prs/${element.id}/update`);
    }

    setActive(element: any) {
        this.departmentService.setActive(element.id).subscribe(() => {
            this.alertService.success(`Máy in ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setDisable(element: any) {
        this.departmentService.setInactive(element.id).subscribe(() => {
            this.alertService.success(`Máy in ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    openDetail(element: any){
        this.router.navigateByUrl(`/sbb/assets/prs/${element.id}`);
    }

}