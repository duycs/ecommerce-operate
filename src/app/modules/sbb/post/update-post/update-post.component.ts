import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { PostService } from 'src/app/services/post.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
})

export class UpdatePostComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
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
    private fb: FormBuilder,
    private postService: PostService,
    private alertService: AlertService,
    private router: Router,
    private mappingModels: MappingModels,
    private activeRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.postId = this.activeRoute.snapshot.params['id'];
    this.getPost();
    this.form = this.fb.group({
      content: [null, Validators.required],
    })
  }

  okClick(): void {
  }

  getPost() {
    this.postService.getPost(this.postId)
      .subscribe(data => {
        this.postDetail = data;
        this.form.get('content')?.setValue(this.postDetail.content);

        if (data.children.length > 0) {
          this.dataSource.data = this.postDetail.children;
        } else {
          this.dataSource.data = [data];
        }
      });
  }

  remove(element: any) {
    this.dataSource.data = this.dataSource.data.filter((c: any) => c.productId !== element.productId);
  }

  save() {
    let children = this.dataSource.data.map((c: any) => { return { Id: c.id, ProductId: c.productId, Content: c.content } });
    let data = {
      ShopId: this.postDetail.shopId,
      Type: this.postDetail.type,
      Content: this.form.get('content')?.value,
      Children: children
    };

    this.postService.updatePost(this.postDetail.id, data)
      .subscribe(() => {
        this.alertService.showToastSuccess();
        this.router.navigateByUrl(`sbb/posts/${this.postDetail.id}`);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

}