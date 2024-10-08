import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';

import { MappingModels } from 'src/app/shared/models/mappingModels';
import { MoneyReasonDataSource } from './money-reason-data-source';
import { CreateMoneyReasonComponent } from '../create-money-reason/create-money-reason.component';
import { EditMoneyReasonComponent } from '../edit-money-reason/edit-money-reason.component';
import { DeleteMoneyReasonComponent } from '../delete-money-reason/delete-money-reason.component';
import { AccountantService } from 'src/app/services/accountant.service';

@Component({
    selector: 'app-money-reason-list',
    templateUrl: './money-reason-list.component.html',
})

export class MoneyReasonListComponent implements OnInit {
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "name",
            name: "tiêu đề",
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
            id: "reasonTypeId",
            name: "loại phiếu",
            type: "option",
            select: "many",
            options: [
                { index: 1, id: 1, name: 'phiếu thu', isSelected: false },
                { index: 2, id: 2, name: 'phiếu chi', isSelected: false },
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "isActive",
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
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numberialOrder', 'name', 'type', 'description', 'status', 'action'];

    dataSource!: MoneyReasonDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private accountantService: AccountantService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private mappingModels: MappingModels,
        private alertService: AlertService) {
        this.dataSource = new MoneyReasonDataSource(this.accountantService, this.mappingModels);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};

        if (this.route.snapshot.queryParams["name"]) queryParams.name = this.route.snapshot.queryParams["name"];
        if (this.route.snapshot.queryParams["description"]) queryParams.description = this.route.snapshot.queryParams["description"];
        if (this.route.snapshot.queryParams["reasonTypeId"]) queryParams.reasonTypeId = this.route.snapshot.queryParams["reasonTypeId"];
        if (this.route.snapshot.queryParams["isActive"]) queryParams.isActive = this.route.snapshot.queryParams["isActive"];

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

    openAddDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};

        const dialogRef = this.dialog.open(CreateMoneyReasonComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            result => {
                setTimeout(() => {
                    console.log("reload after added", result);
                    this.loadPage();
                }, environment.loadTimeout);
            }
        );
    }


    openUpdateDialog(element: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = element;

        const dialogRef = this.dialog.open(EditMoneyReasonComponent, dialogConfig);

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
        const dialogRef = this.dialog.open(DeleteMoneyReasonComponent, {
            data: { id: element.id, name: element.name },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

}