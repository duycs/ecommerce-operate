import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { PostService } from 'src/app/services/post.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-create-post-language',
  templateUrl: './create-post-language.component.html',
})

export class CreatePostLanguageComponent implements OnInit, AfterViewInit {
  postId!: any;
  postDetail!: any;
  displayedColumns = ["orderNumber", "image", "name", "category", "brand", "price", "description", "action"]
  length = 50;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  dataSource = new MatTableDataSource<any>([]);
  pageEvent!: PageEvent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private postService: PostService,
    private alertService: AlertService,
    private router: Router,
    private mappingModels: MappingModels,
    private activeRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.getPost();
  }

  ngOnInit(): void {
    this.postId = this.activeRoute.snapshot.params['id'];
  }

  okClick(): void {
  }

  getPost() {
    this.postService.getPost(this.postId)
      .subscribe(data => {
        this.postDetail = data;
        if (data.children.length > 0) {
          this.dataSource.data = this.postDetail.children;
        } else {
          this.dataSource.data = [data];
        }
      });
  }

  openRemoveDialog(element: any){

  }

  save(){

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    //this.loadPage();
  }

}