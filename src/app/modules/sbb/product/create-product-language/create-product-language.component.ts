import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';
import { ProductDetailDto } from 'src/app/shared/models/product/productDetailDto';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product-language',
  templateUrl: './create-product-language.component.html',
})

export class CreateProductLanguageComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  productId!: any;
  productDetail!: ProductDetailDto;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private alertService: AlertService,
    private mappingModels: MappingModels,
    private activeRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.getProduct();
  }

  ngOnInit(): void {
    this.productId = this.activeRoute.snapshot.params['id'];

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      cost: ['', Validators.required],
      description: ['', [Validators.required]],
    });
    
  }

  okClick(): void {
  }

  getProduct() {
    this.productService.getProduct(this.productId)
      .subscribe(res => {
        this.productDetail = this.mappingModels.ToDisplayProductDetailDto(res);
        this.form.patchValue(res);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  save() {

  }

}