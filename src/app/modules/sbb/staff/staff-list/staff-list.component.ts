import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { StaffAccountDataSource } from './staff-data-source';
import { StaffService } from 'src/app/services/staff.service';
import { DateService } from 'src/app/shared/date.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
    selector: 'app-staff-list',
    templateUrl: './staff-list.component.html',
})

export class StaffListComponent implements OnInit {
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
            name: "họ tên",
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
            id: "permission",
            name: "nhóm quyền",
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

    displayedColumns: string[] = ['numbericalOrder', 'name', 'email', 'phoneNumber', 'permission', 'status', 'action'];

    dataSource!: StaffAccountDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private staffService: StaffService,
        private mappingModels: MappingModels,
        private dialog: MatDialog,
        private dateService: DateService,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new StaffAccountDataSource(this.staffService, this.mappingModels);
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
            queryParams = this.dateService.getQueryDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["email"]) queryParams.email = this.activeRoute.snapshot.queryParams["email"];
        if (this.activeRoute.snapshot.queryParams["active"]) queryParams.active = this.activeRoute.snapshot.queryParams["active"];
        if (this.activeRoute.snapshot.queryParams["phoneNumber"]) queryParams.phoneNumber = this.activeRoute.snapshot.queryParams["phoneNumber"];
        if (this.activeRoute.snapshot.queryParams["description"]) queryParams.description = this.activeRoute.snapshot.queryParams["description"];
        if (this.activeRoute.snapshot.queryParams["permissions"]) queryParams.permissions = this.activeRoute.snapshot.queryParams["permissions"];

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
        this.router.navigateByUrl('/sbb/create-staff');
    }

    openUpdateDialog(element: any) {
        
    }

    setActive(element: any) {
        this.staffService.setActive(element.id).subscribe(() => {
            this.alertService.showToastMessage(`Nhân viên ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        })
    }

    setInactive(element: any) {
        this.staffService.setInactive(element.id).subscribe(() => {
            this.alertService.showToastMessage(`Nhân viên ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        })
    }

}