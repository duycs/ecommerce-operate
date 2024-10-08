import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { MoneyAccountDebtDataSource } from './money-account-debt-data-source';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { DeleteProductComponent } from '../../product/delete-product/delete-product.component';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountantService } from 'src/app/services/accountant.service';
import { DateService } from 'src/app/shared/date.service';
import { MoneyTransactionDetailComponent } from '../money-transaction-detail/money-transaction-detail.component';

@Component({
  selector: 'app-money-account-detail',
  templateUrl: './money-account-detail.component.html',
})

export class MoneyAccountDetailComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  moneyAccountId!: any;
  moneyAccount: any;

  displayedColumns: string[] = ['numbericalOrder', 'createDate', 'category', 'billCode', 'description', 'currency', 'beforeDebt', 'money', 'afterDebt', 'action'];
  allOptions: any[] = [
    {
      id: "createdDate",
      name: "khoảng thời gian biến động",
      type: "dateRange",
      select: "",
      values: "",
      viewValues: "",
      isSelected: false
    },
    {
      id: "categoryTypeId",
      name: "loại phiếu",
      type: "option",
      select: "one",
      options: [
        { index: 1, id: 1, name: 'thu', isSelected: false },
        { index: 2, id: 2, name: 'chi', isSelected: false },
      ],
      values: "",
      viewValues: "",
      isSelected: false
    },
    {
      id: "billCode",
      name: "mã giao dịch",
      type: "text",
      values: "",
      viewValues: "",
      isSelected: false
    },
    // {
    //   id: "currencyTypeId",
    //   name: "đơn vị tiền tệ",
    //   type: "option",
    //   select: "one",
    //   options: [
    //     { index: 1, id: 1, name: 'VND', isSelected: false },
    //     { index: 2, id: 2, name: 'CYK', isSelected: false },
    //   ],
    //   values: "",
    //   viewValues: "",
    //   isSelected: false
    // },
  ];

  dataSource!: MoneyAccountDebtDataSource;

  length = 50;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  pageEvent!: PageEvent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private accountantService: AccountantService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private mappingModels: MappingModels,
    private dateService: DateService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MoneyAccountDebtDataSource(this.accountantService, this.mappingModels);
  }

  ngAfterViewInit(): void {
    this.getMoneyAccounts();
  }

  ngOnInit(): void {
    this.moneyAccountId = this.activeRoute.snapshot.params['id'];
    this.dataSource.loadData(this.getQueryParams());
  }

  getMoneyAccounts() {
    this.accountantService.getMoneyAccount(this.moneyAccountId)
      .subscribe(res => {
        this.moneyAccount = res;
        
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  getQueryParams() {
    let queryParams: any = {};
    queryParams.moneyAccountId = this.moneyAccountId;

    if (this.activeRoute.snapshot.queryParams["createdDate"]) {
      let createdDate = this.activeRoute.snapshot.queryParams["createdDate"];
      queryParams = this.dateService.getQueryCreatedDates(queryParams, createdDate)
    }

    if (this.activeRoute.snapshot.queryParams["billCode"]) queryParams.billCode = this.activeRoute.snapshot.queryParams["billCode"];
    if (this.activeRoute.snapshot.queryParams["categoryTypeId"]) queryParams.categoryTypeId = this.activeRoute.snapshot.queryParams["categoryTypeId"];

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

  openRemoveDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteProductComponent, {
      data: { id: element.id, name: element.name },
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.loadPage();
      }, environment.loadTimeout);
    });
  }

  openDetail(element: any) {
    const dialogRef = this.dialog.open(MoneyTransactionDetailComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.loadPage();
      }, environment.loadTimeout);
    });
  }

}