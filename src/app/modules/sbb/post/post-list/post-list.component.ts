import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { PostDataSource } from './post-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { ShopService } from 'src/app/services/shop.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { DeletePostComponent } from '../delete-post/delete-post.component';
import { PostService } from 'src/app/services/post.service';
import { DateService } from 'src/app/shared/date.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
})

export class PostListComponent implements OnInit {

    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    queryParams!: any;
    allOptions: any[] = [
        {
            id: "createdDate",
            name: "khoảng ngày tạo",
            type: "dateRange",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "createdBy",
            name: "tạo bởi",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "content",
            name: "nội dung bài đăng",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "productId",
            name: "sản phẩm",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "shopId",
            name: "nhà cung cấp",
            type: "option",
            select: "one",
            options: [],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "textId",
            name: "id bài đăng",
            type: "text",
            select: "",
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "isDeleted",
            name: "trạng thái hoạt động",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: "false", name: 'hoạt động', isSelected: false },
                { index: 2, id: "true", name: 'không hoạt động', isSelected: false },
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "autoApprove",
            name: "duyệt tự động",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: "true", name: 'Có', isSelected: false },
                { index: 2, id: "false", name: 'Không', isSelected: false },
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        {
            id: "approve",
            name: "trạng thái phê duyệt",
            type: "option",
            select: "one",
            options: [
                { index: 1, id: "true", name: 'đã duyệt', isSelected: false },
                { index: 2, id: "false", name: 'từ chối', isSelected: false },
                { index: 3, id: null, name: 'chưa duyệt', isSelected: false },
            ],
            values: "",
            viewValues: "",
            isSelected: false
        },
        // {
        //     id: "languageId",
        //     name: "phiên bản ngôn ngữ",
        //     type: "option",
        //     select: "many",
        //     options: [
        //         { index: 1, id: "1", name: 'Việt Nam', isSelected: false },
        //         { index: 2, id: "2", name: 'Trung Quốc', isSelected: false },
        //     ],
        //     values: "",
        //     viewValues: "",
        //     isSelected: false
        // },
    ];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;
    
    searchKeywords: any[] = [];

    displayedColumns: string[] = ['orderNumber', 'id', 'image', 'shop', 'product', 'content', 'language',  'createDate', 'autoApprove', 'status', 'approve', 'action'];

    dataSource!: PostDataSource;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private translateService: TranslateService,
        private postService: PostService,
        private shopService: ShopService,
        private productService: ProductService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private dateService: DateService,
        private mappingModels: MappingModels,
        private router: Router,
        private alertService: AlertService) {
        this.dataSource = new PostDataSource(this.postService, this.mappingModels);
    }

    ngAfterViewInit() {
        this.initFilterShopOptions();
        this.initFilterProductOptions();
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

        if (this.activeRoute.snapshot.queryParams["textId"]) queryParams.textId = this.activeRoute.snapshot.queryParams["textId"];
        if (this.activeRoute.snapshot.queryParams["productId"]) queryParams.productId = this.activeRoute.snapshot.queryParams["productId"];
        if (this.activeRoute.snapshot.queryParams["shopId"]) queryParams.shopId = this.activeRoute.snapshot.queryParams["shopId"];
        if (this.activeRoute.snapshot.queryParams["content"]) queryParams.content = this.activeRoute.snapshot.queryParams["content"];
        if (this.activeRoute.snapshot.queryParams["type"]) queryParams.type = this.activeRoute.snapshot.queryParams["type"];
        if (this.activeRoute.snapshot.queryParams["createdBy"]) queryParams.createdBy = this.activeRoute.snapshot.queryParams["createdBy"];
        if (this.activeRoute.snapshot.queryParams["active"]) queryParams.active = this.activeRoute.snapshot.queryParams["active"];
        if (this.activeRoute.snapshot.queryParams["approve"]) queryParams.approve = this.activeRoute.snapshot.queryParams["approve"];
        if (this.activeRoute.snapshot.queryParams["autoApprove"]) queryParams.autoApprove = this.activeRoute.snapshot.queryParams["autoApprove"]

        return queryParams;
    }


    initFilterShopOptions() {
        this.shopService.getShops({} as any, 0, 10000).subscribe((pageData) => {
            let options = pageData.data;
            this.allOptions.map(o => {
                if (o.id === 'shopId') {
                    o.options = options;
                }
            });
        });
    }

    initFilterProductOptions() {
        this.productService.getProducts({} as any, 1, 1000).subscribe((pageData) => {
            let options = pageData;
            this.allOptions.map(o => {
                if (o.id === 'productId') {
                    o.options = options;
                }
            });
        });
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
        const dialogRef = this.dialog.open(DeletePostComponent, {
            data: { id: element.id, name: element.name },
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.loadPage();
            }, environment.loadTimeout);
        });
    }

    openDetailDialog(element: any) {
        this.router.navigateByUrl(`sbb/posts/${element.id}`);
    }

    update(element: any){
        this.router.navigateByUrl(`sbb/posts/${element.id}/update`);
    }

    addPost(){

    }
    
    setApproved(element: any) {
        this.postService.approved(element.id).subscribe(() => {
            this.alertService.success(`Bài đăng ${element.name} được phê duyệt`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setActive(element: any) {
        this.postService.active(element.id).subscribe(() => {
            this.alertService.success(`Bài đăng ${element.name} ở trạng thái hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setDisable(element: any) {
        this.postService.disable(element.id).subscribe(() => {
            this.alertService.success(`Bài đăng ${element.name} ở trạng thái không hoạt động`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    setDecline(element: any) {
        this.postService.decline(element.id).subscribe(() => {
            this.alertService.success(`Bài đăng ${element.name} đã bị từ chối`);
            this.loadPage();
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

}