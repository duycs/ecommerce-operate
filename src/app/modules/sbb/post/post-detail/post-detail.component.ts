import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { PostService } from 'src/app/services/post.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
})

export class PostDetailComponent implements OnInit, AfterViewInit {
  postId!: any;
  postDetail!: any;
  displayedColumns = ["orderNumber", "image", "name", "category", "brand", "price", "description"]
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
        if (data) {
          this.postDetail = this.mappingModels.ToDisplayPostDto(data);;

          if (data.children.length > 0) {
            this.dataSource.data = this.postDetail.children;
          } else {
            this.dataSource.data = [data];
          }
        }
      });
  }

  createLanguages() {
    this.router.navigateByUrl(`sbb/posts/${this.postId}/create-language`);
  }

  openRemoveDialog(element: any) {

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  approved() {
    this.postService.approved(this.postId).subscribe(() => {
      this.getPost();
      this.alertService.success(`Bài đăng ${this.postDetail.name} được phê duyệt`);
    }, (err) => {
      this.alertService.showToastError();
      console.log(err);
    });
  }

  edit() {
    this.router.navigateByUrl(`sbb/posts/${this.postId}/update`);
  }

  setActive() {
    this.postService.active(this.postId).subscribe(() => {
      this.getPost();
      this.alertService.success(`Bài đăng ${this.postDetail.name} ở trạng thái hoạt động`);
    }, (err) => {
      this.alertService.showToastError();
      console.log(err);
    });
  }

  setDisable() {
    this.postService.disable(this.postId).subscribe(() => {
      this.getPost();
      this.alertService.success(`Bài đăng ${this.postDetail.name} ở trạng thái không hoạt động`);
    }, (err) => {
      this.alertService.showToastError();
      console.log(err);
    });
  }

  setDecline() {
    this.postService.decline(this.postId).subscribe(() => {
        this.alertService.success(`Bài đăng ${this.postDetail.name} đã bị từ chối`);
        this.getPost();
    }, (err) => {
        this.alertService.showToastError();
        console.log(err);
    });
}

}