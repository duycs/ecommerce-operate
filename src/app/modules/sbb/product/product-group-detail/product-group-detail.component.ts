import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-product-group-detail',
  templateUrl: './product-group-detail.component.html',
})

export class ProductGroupDetailComponent implements OnInit, AfterViewInit {
  id!: any;
  group!: any;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router,
    private mappingModels: MappingModels,
    private activeRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.getProductGroup();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'];
  }

  okClick(): void {
  }

  getProductGroup() {
    this.productService.getProductGroup(this.id)
      .subscribe(res => {
        this.group = this.mappingModels.ToDisplayProductGroupDto(res);

      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  setVisible() {
    this.productService.visibleProductGroup(this.id).subscribe(() => {
      this.alertService.success(`Nhóm sản phẩm ${this.group.name} ở trạng thái hiển thị`);
    }, (err) => {
      this.alertService.showToastError();
      console.log(err);
    });
  }

  setInvisible() {
    this.productService.invisibleProductGroup(this.id).subscribe(() => {
      this.alertService.success(`Nhóm sản phẩm ${this.group.name} ở trạng thái không hiển thị`);
    }, (err) => {
      this.alertService.showToastError();
      console.log(err);
    });
  }

}