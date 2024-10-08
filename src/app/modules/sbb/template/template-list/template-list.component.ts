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
import { environment } from 'src/environments/environment';
import { TemplateDataSource } from './template-data-source';
import { TemplateDetailComponent } from '../template-detail/template-detail.component';
import { UpdateTemplateProductProfitComponent } from '../update-template-product-profit/update-template-product-profit.component';
import { UpdateTemplateTransporterCostComponent } from '../update-template-transporter-cost/update-template-transporter-cost.component';

@Component({
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
})

export class TemplateListComponent implements OnInit {
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "name",
            name: "tên mẫu",
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
            id: "type",
            name: "loại",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: 1, name: 'lợi nhuận theo giá nhập(1)', isSelected: false },
                { index: 2, id: 2, name: 'chi phí vận chuyển theo danh mục(2)', isSelected: false },
                { index: 3, id: 3, name: 'lợi nhuận sản phẩm theo danh mục của NCC(3)', isSelected: false },
                { index: 4, id: 4, name: 'lợi nhuận theo từng sản phẩm(4)', isSelected: false },
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

    displayedColumns: string[] = ['numbericalOrder', 'name', 'code', 'type', 'settings', 'description', 'lastUpdatedDate', 'lastUpdatedBy', 'action'];

    dataSource!: TemplateDataSource;

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
        this.dataSource = new TemplateDataSource(this.templateService);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }


    getQueryParams() {
        let queryParams: any = {};

        if (this.route.snapshot.queryParams["createdDate"]) {
            let createdDate = this.route.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.route.snapshot.queryParams["type"]) queryParams.type = this.route.snapshot.queryParams["type"];
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

    // add() {
    //     const dialogRef = this.dialog.open(CreateTemplateProductProfitComponent, {
    //         data: {
    //         },
    //     });

    //     dialogRef.afterClosed().subscribe(() => {
    //         setTimeout(() => {
    //             this.loadPage();
    //         }, environment.loadTimeout);
    //     });
    // }

    update(element: any) {
        switch (element.type) {
            case 1:
                this.dialog.open(UpdateTemplateProductProfitComponent, {
                    data: element,
                }).afterClosed().subscribe(() => {
                    setTimeout(() => {
                        this.loadPage();
                    }, environment.loadTimeout);
                });

                break;

            case 2:
                this.dialog.open(UpdateTemplateTransporterCostComponent, {
                    data: element,
                }).afterClosed().subscribe(() => {
                    setTimeout(() => {
                        this.loadPage();
                    }, environment.loadTimeout);
                });

                break;

            default:
                break;
        }

    }

    openDetail(element: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = element;
        dialogConfig.width = '50vw';
        dialogConfig.data = element;

        const dialogRef = this.dialog.open(TemplateDetailComponent
            , dialogConfig);

        dialogRef.afterClosed().subscribe(() => {
        });
    }

    remove(element: any) {
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


