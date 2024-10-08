import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { PermissionDataSource } from './permission-data-source';
import { SettingService } from 'src/app/services/setting.service';
import { DateService } from 'src/app/shared/date.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
    selector: 'app-permission-list',
    templateUrl: './permission-list.component.html',
})

export class PermissionListComponent implements OnInit {
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
            name: "tên nhóm quyền",
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
            id: "permission",
            name: "quyền",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdDate",
            name: "khoảng ngày tạo",
            type: "dateRange",
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

    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'description', 'createdDate', 'action'];

    dataSource!: PermissionDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private activeRoute: ActivatedRoute,
        private dateService: DateService,
        private settingService: SettingService,
        private configService: ConfigService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new PermissionDataSource(this.settingService);
    }

    ngAfterViewInit() {
        this.initFilterOptions();
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    initFilterOptions() {
        this.allOptions.map(o => {
            if (o.id === 'permission') {
                o.options = this.configService.getPermissions();
            }
        });
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["name"]) queryParams.name = this.activeRoute.snapshot.queryParams["name"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["description"]) queryParams.description = this.activeRoute.snapshot.queryParams["description"];
        if (this.activeRoute.snapshot.queryParams["permission"]) queryParams.permission = this.activeRoute.snapshot.queryParams["permission"];

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

    add(){
        this.router.navigateByUrl('/setting/create-permission-group');
    }

    update(element: any){
        this.router.navigateByUrl(`/setting/permission/groups/${element.id}/edit`);
    }

    detail(element: any){
        this.router.navigateByUrl(`/setting/permission/groups/${element.id}`);
    }

    openRemoveDialog(element: any){

    }

}