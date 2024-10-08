import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';
import { ProductDetailDto } from 'src/app/shared/models/product/productDetailDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { TemplateService } from 'src/app/services/template.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})

export class ProductDetailComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  productId!: any;
  productDetail!: any;
  viewPrice = false;

  constructor(
    public authService: AuthService,
    private templateService: TemplateService,
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router,
    private mappingModels: MappingModels,
    private activeRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.getProduct();
  }

  ngOnInit(): void {
    this.productId = this.activeRoute.snapshot.params['id'];
  }

  okClick(): void {
  }

  getProduct() {
    this.productService.getProduct(this.productId)
      .subscribe(res => {
        this.productDetail = this.mappingModels.ToDisplayProductDetailDto(res);

      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  createLanguages() {
    this.router.navigateByUrl(`sbb/products/${this.productId}/create-language`);
  }

  setActiveProduct() {
    this.productService.activeProduct(this.productId).subscribe(() => {
      this.alertService.success(`Sản phẩm ${this.productId} ở trạng thái phê duyệt`);
      //this.getProduct();
      this.updateSalePriceBySettings(this.productId, this.productDetail.shopId);
    }, (err) => {
      this.alertService.showToastError();
      console.log(err);
    });
  }

  setDisableProduct() {
    this.productService.disableProduct(this.productId).subscribe(() => {
      this.alertService.success(`Sản phẩm ${this.productId} ở trạng thái chưa phê duyệt`);
      //this.getProduct();
      this.updateSalePriceZero(this.productId);
    }, (err) => {
      this.alertService.showToastError();
      console.log(err);
    });
  }

  updateSalePriceBySettings(productId: any, shopId: any) {
    let data: any = {
      ShopIds: [shopId],
      ProductIds: [productId]
    };

    this.templateService.updateSalePrices(data)
      .subscribe((totalUpdated: any) => {
        this.alertService.showToastMessage(`Đã cập nhật giá cho sản phẩm`);
        this.getProduct();
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  updateSalePriceZero(productId: any) {
    let productPriceSettings: any = [
      {
        productId: productId,
        upPrice: 0,
        note: ''
      }];

    let data = {
      productPriceSettings: productPriceSettings
    };

    this.productService.createProductPriceSettings(data)
      .subscribe(() => {
        this.alertService.showToastSuccess();
        this.getProduct();
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });

  }

}