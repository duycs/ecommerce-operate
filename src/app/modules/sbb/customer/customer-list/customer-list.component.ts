import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

import { CustomerDataSource } from './customer-data-source';
import { CustomerService } from 'src/app/services/customer.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
})

export class CustomerListComponent implements OnInit {
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
            id: "address",
            name: "địa chỉ",
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
            id: "isActive",
            name: "trạng thái",
            type: "option",
            select: "many",
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

    displayedColumns: string[] = ['numericalOrder', 'name', 'phoneNumber', 'address', 'orderNumber', 'debt', 'debtLimit', 'status', 'action'];

    dataSource!: CustomerDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private mappingModels: MappingModels,
        private customerService: CustomerService,
        private route: ActivatedRoute,
        private alertService: AlertService) {
        // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
        //   this.currentUser = user;
        // });
        this.dataSource = new CustomerDataSource(this.customerService, this.mappingModels);
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
            phoneNumber: this.route.snapshot.queryParams["phoneNumber"],
            isActive: this.route.snapshot.queryParams["isActive"]
        } as any;

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

    setDisable(element: any) {
        this.customerService.disableCustomer(element.id).subscribe(() => {
            this.alertService.success(`Khách hàng ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

}