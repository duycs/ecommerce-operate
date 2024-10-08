import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { DateService } from 'src/app/shared/date.service';
import { PrintService } from 'src/app/services/print.service';
import { TemplateService } from 'src/app/services/template.service';
import { TemplateProductProfitDataSource } from './template-product-profit-data-source';
import { CreateTemplateProductProfitComponent } from '../create-template-product-profit/create-template-product-profit.component';
import { UpdateTemplateProductProfitComponent } from '../update-template-product-profit/update-template-product-profit.component';
import { TemplateProductProfitDetailComponent } from '../template-product-profit-detail/template-product-profit-detail.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-template-product-profit-list',
    templateUrl: './template-product-profit-list.html',
})

export class TemplateProductProfitListComponent implements OnInit {
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "name",
            name: "tên",
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
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'settings', 'lastUpdatedDate', 'lastUpdatedBy', 'description', 'action'];

    dataSource!: TemplateProductProfitDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Input() showHeader = true;

    constructor(
        private translateService: TranslateService,
        private templateService: TemplateService,
        private printService: PrintService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private dateService: DateService,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new TemplateProductProfitDataSource(this.templateService);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }


    getQueryParams() {
        let queryParams: any = {};

        queryParams.type = 1; // template profit

        if (this.route.snapshot.queryParams["createdDate"]) {
            let createdDate = this.route.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.route.snapshot.queryParams["name"]) queryParams.name = this.route.snapshot.queryParams["name"];
        if (this.route.snapshot.queryParams["code"]) queryParams.code = this.route.snapshot.queryParams["code"];
        if (this.route.snapshot.queryParams["description"]) queryParams.description = this.route.snapshot.queryParams["description"];


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
        const dialogRef = this.dialog.open(CreateTemplateProductProfitComponent, {
            data: {
            },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    update(element: any) {
        const dialogRef = this.dialog.open(UpdateTemplateProductProfitComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    openDetail(element: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = element;
        dialogConfig.width = '50vw';
        dialogConfig.data = element;

        const dialogRef = this.dialog.open(TemplateProductProfitDetailComponent
            , dialogConfig);

        dialogRef.afterClosed().subscribe(() => {
        });
    }

    remove(element: any){
        this.templateService.removeTemplate(element.id)
        .subscribe(() => {
          this.alertService.showToastSuccess();
          this.loadPage();
        }, (err) => {
          this.alertService.showToastError();
          console.log(err);
        });
    }
}


