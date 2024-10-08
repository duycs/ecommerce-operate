import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { CustomerWaitActiveDataSource } from './customer-wait-active-data-source';
import { CustomerService } from 'src/app/services/customer.service';

import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';

@Component({
    selector: 'app-customer-wait-active-list',
    templateUrl: './customer-wait-active-list.component.html',
})

export class CustomerWaitActiveListComponent implements OnInit {
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
            name: "tên",
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
            id: "email",
            name: "email",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "address",
            name: "địa chỉ",
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

    displayedColumns: string[] = ['numericalOrder', 'name', 'phoneNumber', 'email', 'gender', 'dob', 'address', 'action'];

    dataSource!: CustomerWaitActiveDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private AuthService: AuthService,
        private customerService: CustomerService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private alertService: AlertService) {
        // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
        //   this.currentUser = user;
        // });
        this.dataSource = new CustomerWaitActiveDataSource(this.customerService);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.dataSource.loadData(this.getQueryParams());
    }

    getQueryParams() {
        let queryParams = {
            name: this.route.snapshot.queryParams["name"],
            address: this.route.snapshot.queryParams["address"],
            email: this.route.snapshot.queryParams["email"],
            phoneNumber: this.route.snapshot.queryParams["phoneNumber"],
        } as any;

        queryParams.isActive = "false";
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

    remove(element: any){

    }

    setActive(element: any) {
        this.customerService.activeCustomer(element.id).subscribe(() => {
            this.alertService.success(`Khách hàng ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

}