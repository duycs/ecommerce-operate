import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomerDebtConfigDataSource } from './customer-debt-config-data-source';
import { CustomerService } from 'src/app/services/customer.service';
import { DateService } from 'src/app/shared/date.service';

@Component({
    selector: 'app-customer-debt-config-list',
    templateUrl: './customer-debt-config-list.component.html',
})

export class CustomerDebtConfigListComponent implements OnInit {
    currentUser!: any;
    currentUserSubscription!: Subscription;
    customerId!: any;
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "createdDate",
            name: "ngày tạo phiếu",
            type: "dateRange",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "note",
            name: "ghi chú",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdBy",
            name: "người thiết lập",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "customerId",
            name: "khách hàng",
            type: "option",
            select: "one",
            values: [],
            viewValues: "",
            isSelected: false
        },
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['numericalOrder', 'code', 'customer', 'currentDebtLimit', 'newDebtLimit', 'creator', 'note', 'createDate', 'action'];

    dataSource!: CustomerDebtConfigDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private dateService: DateService,
        private customerService: CustomerService,
        private router: Router,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService) {
        // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
        //   this.currentUser = user;
        // });
        this.dataSource = new CustomerDebtConfigDataSource(this.customerService);
    }

    ngAfterViewInit() {
        this.initFilterCustomerOptions();
    }

    ngOnInit(): void {
        this.customerId = this.activeRoute.snapshot.params['id'];
        this.dataSource.loadData(this.customerId, this.getQueryParams());
    }

    getQueryParams() {
        let queryParams: any = {};
        if (this.activeRoute.snapshot.queryParams["createdDate"]) {
            let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
            queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
        }

        if (this.activeRoute.snapshot.queryParams["note"]) queryParams.note = this.activeRoute.snapshot.queryParams["note"];
        if (this.activeRoute.snapshot.queryParams["customerId"]) queryParams.customerId = this.activeRoute.snapshot.queryParams["customerId"];
        if (this.activeRoute.snapshot.queryParams["code"]) queryParams.code = this.activeRoute.snapshot.queryParams["code"];
        if (this.activeRoute.snapshot.queryParams["createdBy"]) queryParams.createdBy = this.activeRoute.snapshot.queryParams["createdBy"];

        return queryParams;
    }

    initFilterCustomerOptions() {
        let customerQueryParams = {} as any;
        this.customerService.getCustomers(customerQueryParams, 0, 10000).subscribe((pageData) => {
            let options = pageData.data;
            this.allOptions.map(o => {
                if (o.id === 'customerId') {
                    o.options = options;
                }
            });
        });
    }

    updateSearch(event: any) {
        this.dataSource.loadData(this.customerId, this.getQueryParams());
    }

    loadPage() {
        this.dataSource.loadData(
            this.customerId,
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

    remove(element: any){

    }

    addCustomerDebtConfig(){
        this.router.navigateByUrl(`/sbb/create-customer-debt-config`);
    }

}